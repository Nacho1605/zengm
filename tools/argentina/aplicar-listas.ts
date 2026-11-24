// Aplica las listas que el usuario copia de la escalera (OVR y rasgos). Uso:
//
//   node tools/argentina/aplicar-listas.ts data/argentina/escalera/listas/FECHA.txt
//
// Líneas que entiende (el resto se ignora):
//   EQUIPO Nombre Apellido: 70 → 69                 (OVR, con ajustar-ovr.ts)
//   EQUIPO Nombre Apellido: + gambeta+, − pase      (rasgos: + agrega, − quita)
//
// Primero los OVR, después los rasgos. A un jugador con ratings a mano, un
// rasgo que cambia le suma el mismo corrimiento que le daría el generador
// (con el OVR exacto), como las secundarias: el usuario prefiere la
// consistencia del archivo a sus retoques (24/11).

import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { escribirPlantel, leerPlantel, nombreCompleto, norm } from "./plantel-io.ts";
import {
	FORMA_VIGENTE,
	generarRatings,
	KEYS,
	ovrOficial,
	posicion,
	RASGOS_ARQUERO,
	RASGOS_AMBOS,
	SIN_TIRO,
} from "./ratings-futbol.ts";

const SEASON = 2026;
// Nombres que la escalera mostraba distinto (corregidos después)
const ALIAS: Record<string, string> = { "walter mazzanti": "walter mazzantti" };

const archivo = process.argv[2];
if (!archivo) {
	throw new Error("Uso: node aplicar-listas.ts LISTA.txt");
}
const lineas = readFileSync(archivo, "utf8").split("\n").map((l) => l.trim());
const ovr = lineas
	.map((l) => l.match(/^([A-Z]{3}) (.+): (\d+) → (\d+)$/))
	.filter((m) => m)
	.map((m) => ({ eq: m![1]!, nombre: m![2]!, viejo: Number(m![3]), nuevo: Number(m![4]) }));
const rasgos = lineas
	.map((l) => l.match(/^([A-Z]{3}) (.+?): ([+−-] .+)$/))
	.filter((m) => m)
	.map((m) => ({
		eq: m![1]!,
		nombre: m![2]!,
		cambios: m![3]!.split(",").map((x) => {
			const [signo, ...resto] = x.trim().split(" ");
			return { signo: signo === "+" ? "+" : "−", rasgo: resto.join(" ") };
		}),
	}));

const buscar = (d: any, nombre: string) => {
	const n = ALIAS[norm(nombre)] ?? norm(nombre);
	const js = d.jugadores.filter((j: any) => norm(nombreCompleto(j)) === n);
	if (js.length !== 1) {
		throw new Error(`${d.equipo} ${nombre}: ${js.length} coincidencias`);
	}
	return js[0];
};

// 1. OVR
let avisos = 0;
for (const c of ovr) {
	const { d } = leerPlantel(c.eq);
	const j = buscar(d, c.nombre);
	if (j.ovr !== c.viejo) {
		console.log(`AVISO ${c.eq} ${c.nombre}: tenía ${j.ovr}, la lista dice ${c.viejo}`);
		avisos++;
	}
	const args = [new URL("ajustar-ovr.ts", import.meta.url).pathname, c.eq, j.apellido || j.nombre, String(c.nuevo)];
	if (j.apellido) {
		args.push(j.nombre);
	}
	process.stdout.write(execFileSync(process.execPath, args, { encoding: "utf8" }));
}

// 2. Rasgos
const validos = new Set(Object.keys(FORMA_VIGENTE.rasgos));
for (const c of rasgos) {
	const { ruta, original, d } = leerPlantel(c.eq);
	const j = buscar(d, c.nombre);
	const antes: string[] = j.rasgos ?? [];
	let fin = [...antes];
	const arquero = j.pos === "Portero";
	for (const { signo, rasgo } of c.cambios) {
		const base = rasgo.replace(/\+$/, "");
		if (!validos.has(base)) {
			throw new Error(`${c.eq} ${c.nombre}: rasgo desconocido "${rasgo}"`);
		}
		if (arquero ? !RASGOS_ARQUERO.includes(base) && !RASGOS_AMBOS.includes(base) : RASGOS_ARQUERO.includes(base)) {
			console.log(`AVISO ${c.eq} ${c.nombre}: "${rasgo}" no es para su puesto`);
			avisos++;
		}
		if (signo === "−") {
			if (!fin.includes(rasgo)) {
				console.log(`AVISO ${c.eq} ${c.nombre}: no tenía "${rasgo}"`);
				avisos++;
			}
			fin = fin.filter((r) => r !== rasgo);
		} else if (fin.includes(rasgo)) {
			console.log(`AVISO ${c.eq} ${c.nombre}: ya tenía "${rasgo}"`);
			avisos++;
		} else {
			fin.push(rasgo);
		}
	}
	if (j.ratings) {
		// Corrimiento del generador entre los rasgos de antes y los de ahora
		const pos = posicion(j.pos, j.pie ?? null);
		const edad = SEASON - Number(j.nac.split("/")[2]);
		const con = generarRatings({ ...j, rasgos: fin }, pos, edad, j.ovr, FORMA_VIGENTE);
		const sin = generarRatings({ ...j, rasgos: antes }, pos, edad, j.ovr, FORMA_VIGENTE);
		const r: Record<string, number> = { ...j.ratings, hgt: Math.round(((j.altura * 100 - 156) * 100) / 44) };
		for (const k of KEYS) {
			if (k !== "hgt" && !(pos === "C" && SIN_TIRO.includes(k))) {
				r[k] = Math.max(0, Math.min(100, r[k]! + con[k] - sin[k]));
			}
		}
		const llave = ["C", "PF", "FC", "G", "GF"].includes(pos) ? "diq" : "oiq";
		for (let i = 0; i < 20 && ovrOficial(r as any) !== j.ovr; i++) {
			r[llave] = r[llave]! + (ovrOficial(r as any) < j.ovr ? 1 : -1);
		}
		if (ovrOficial(r as any) !== j.ovr) {
			throw new Error(`${c.eq} ${c.nombre}: no llega a OVR ${j.ovr}`);
		}
		const cambios = Object.keys(j.ratings).filter((k) => r[k] !== j.ratings[k]).map((k) => `${k} ${j.ratings[k]}→${r[k]}`);
		j.ratings = Object.fromEntries(Object.keys(j.ratings).map((k) => [k, r[k]]));
		console.log(`${c.eq} ${c.nombre} (ratings tuyos): ${cambios.join(", ")}`);
	}
	if (fin.length) {
		j.rasgos = fin;
	} else {
		delete j.rasgos;
	}
	console.log(`${c.eq} ${c.nombre}: [${antes.join(", ")}] → [${fin.join(", ")}]`);
	escribirPlantel(ruta, original, d);
}
console.log(`${ovr.length} OVR y ${rasgos.length} jugadores con rasgos; avisos: ${avisos}`);
