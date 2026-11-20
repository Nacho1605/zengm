// Pasa a la forma 2 a los jugadores con ratings ajustados a mano por el
// usuario ("ratings" en el plantel) sin perder sus retoques: a sus ratings les
// suma la diferencia entre la forma 2 y la forma 1 del generador para ese
// jugador (mismo OVR, misma semilla), y después los deja en el OVR exacto con
// el mismo retoque fino del generador. Uso:
//
//   node tools/argentina/forma2-a-mano.ts          # muestra lo que haría
//   node tools/argentina/forma2-a-mano.ts --aplicar
//
// Se corre una sola vez (los ratings guardados quedan en la forma 2).

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import {
	FORMA_1,
	FORMA_2,
	generarRatings,
	hgtRating,
	KEYS,
	ovrOficial,
	posicion,
	type Key,
	type Ratings,
} from "./ratings-futbol.ts";

const aplicar = process.argv.includes("--aplicar");
const dir = new URL("../../data/argentina/planteles/", import.meta.url);
const SIN_TIRO = ["ins", "dnk", "fg", "tp"];
let total = 0;
for (const f of readdirSync(dir).filter((x) => x.endsWith(".json"))) {
	const ruta = new URL(f, dir);
	const texto = readFileSync(ruta, "utf8");
	const d = JSON.parse(texto);
	let cambios = 0;
	for (const j of d.jugadores.filter((x: any) => x.ratings)) {
		const pos = posicion(j.pos, j.pie);
		const edad = 2026 - Number(j.nac.slice(-4));
		const g1 = generarRatings(j, pos, edad, j.ovr, FORMA_1);
		const g2 = generarRatings(j, pos, edad, j.ovr, FORMA_2);
		const r = {
			...j.ratings,
			hgt: hgtRating(j.altura * 100),
		} as Ratings;
		if (ovrOficial(r) !== j.ovr) {
			throw new Error(`${j.apellido}: sus ratings dan ${ovrOficial(r)}, no ${j.ovr}`);
		}
		const nuevo = { ...r };
		for (const k of KEYS) {
			if (k === "hgt" || (pos === "C" && SIN_TIRO.includes(k))) {
				continue;
			}
			nuevo[k] = Math.max(0, Math.min(100, r[k] + g2[k] - g1[k]));
		}
		// Retoque fino, como en el generador
		const llave: Key = ["C", "PF", "FC", "G", "GF"].includes(pos) ? "diq" : "oiq";
		for (let i = 0; i < 20 && ovrOficial(nuevo) !== j.ovr; i++) {
			nuevo[llave] += ovrOficial(nuevo) < j.ovr ? 1 : -1;
		}
		if (ovrOficial(nuevo) !== j.ovr) {
			throw new Error(`${j.apellido}: no llega a OVR ${j.ovr}`);
		}
		const dif = Object.keys(j.ratings)
			.filter((k) => nuevo[k as Key] !== j.ratings[k])
			.map((k) => `${k} ${j.ratings[k]}→${nuevo[k as Key]}`);
		console.log(`${d.equipo} ${j.nombre} ${j.apellido} (${pos}, OVR ${j.ovr}): ${dif.join(", ") || "sin cambios"}`);
		j.ratings = Object.fromEntries(Object.keys(j.ratings).map((k) => [k, nuevo[k as Key]]));
		cambios += 1;
		total += 1;
	}
	if (aplicar && cambios > 0) {
		writeFileSync(
			ruta,
			JSON.stringify(d, null, "\t").replace(/"rasgos": \[\n\t+"aereo"\n\t+\]/g, '"rasgos": ["aereo"]') +
				(texto.endsWith("\n") ? "\n" : ""),
		);
	}
}
console.log(`\n${total} jugadores con ratings a mano ${aplicar ? "pasados" : "para pasar"} a la forma 2${aplicar ? "" : " (no se escribió nada)"}.`);
