// equipos.csv: la fuente única de los datos de los equipos (desde la
// v2.23.3; reemplaza a equipos-usuario.json). Una fila por equipo del archivo
// de liga (por tid): abreviatura, ciudad, apodo, nombre oficial completo del
// club (para el College), zona y división, si está activo, colores,
// camiseta, estadio, población y logos. El armado (equipos-interior.ts)
// aplica estos datos; desde-juego.ts escribe acá lo que el usuario cambia en
// el juego; cargar-plantel.ts saca de acá el nombre completo (College).
//
// Regenerar desde una versión armada (conserva "club" y "revisar"):
//
//   node tools/argentina/equipos-csv.ts ARCHIVO.json

import { readFileSync, writeFileSync } from "node:fs";

export const RUTA = new URL("../../data/argentina/equipos.csv", import.meta.url);

export const COLUMNAS = [
	"tid",
	"abreviatura",
	"ciudad",
	"apodo",
	"club",
	"zona",
	"division",
	"activo",
	"colores",
	"camiseta",
	"estadio",
	"poblacion",
	"logo",
	"logo_chico",
	"revisar",
] as const;
export type Fila = Record<(typeof COLUMNAS)[number], string>;

// Campos del equipo en el juego <- columna del CSV
export const CAMPOS: [string, (typeof COLUMNAS)[number], "texto" | "numero" | "colores"][] = [
	["abbrev", "abreviatura", "texto"],
	["region", "ciudad", "texto"],
	["name", "apodo", "texto"],
	["colors", "colores", "colores"],
	["jersey", "camiseta", "texto"],
	["stadiumCapacity", "estadio", "numero"],
	["pop", "poblacion", "numero"],
	["imgURL", "logo", "texto"],
	["imgURLSmall", "logo_chico", "texto"],
];

const parsear = (texto: string) => {
	const filas: string[][] = [];
	let fila: string[] = [];
	let campo = "";
	let comillas = false;
	for (let i = 0; i < texto.length; i++) {
		const c = texto[i]!;
		if (comillas) {
			if (c === '"' && texto[i + 1] === '"') {
				campo += '"';
				i++;
			} else if (c === '"') {
				comillas = false;
			} else {
				campo += c;
			}
		} else if (c === '"') {
			comillas = true;
		} else if (c === ",") {
			fila.push(campo);
			campo = "";
		} else if (c === "\n") {
			fila.push(campo);
			filas.push(fila);
			fila = [];
			campo = "";
		} else if (c !== "\r") {
			campo += c;
		}
	}
	if (campo || fila.length) {
		fila.push(campo);
		filas.push(fila);
	}
	return filas;
};

export const leerEquipos = (ruta: URL | string = RUTA): Fila[] => {
	const [cab, ...resto] = parsear(readFileSync(ruta, "utf8"));
	return resto
		.filter((f) => f.length > 1)
		.map((f) => Object.fromEntries(cab!.map((k, i) => [k, f[i] ?? ""])) as Fila);
};

const celda = (s: string) => (/[",\n]/.test(s) || s === "" ? `"${s.replaceAll('"', '""')}"` : s);
export const escribirEquipos = (filas: Fila[], ruta: URL | string = RUTA) => {
	const lineas = [COLUMNAS.join(","), ...filas.map((f) => COLUMNAS.map((k) => celda(f[k] ?? "")).join(","))];
	writeFileSync(ruta, lineas.join("\n") + "\n");
};

// Valor del CSV convertido al tipo del juego (undefined = celda vacía)
export const valorJuego = (f: Fila, col: (typeof COLUMNAS)[number], tipo: string) => {
	const v = f[col];
	if (v === "") {
		return undefined;
	}
	return tipo === "numero" ? Number(v) : tipo === "colores" ? v.split(" ") : v;
};
const valorCsv = (v: any, tipo: string) =>
	v === undefined || v === null ? "" : tipo === "colores" ? v.join(" ") : String(v);

// Nombre completo de cada club por abreviatura (College)
export const nombresCompletos = () =>
	Object.fromEntries(leerEquipos().filter((f) => f.club).map((f) => [f.abreviatura, f.club]));

// Fila nueva a partir de un equipo del juego (conserva club y revisar)
export const filaDeEquipo = (t: any, ga: any, previa?: Fila): Fila => {
	const confs = ga.confs?.at?.(-1)?.value ?? ga.confs;
	const divs = ga.divs?.at?.(-1)?.value ?? ga.divs;
	const f: any = {
		tid: String(t.tid),
		zona: confs?.find((c: any) => c.cid === t.cid)?.name ?? "",
		division: divs?.find((d: any) => d.did === t.did)?.name ?? "",
		activo: t.disabled ? "no" : "sí",
		club: previa?.club ?? "",
		revisar: previa?.revisar ?? "",
	};
	for (const [campo, col, tipo] of CAMPOS) {
		f[col] = valorCsv(t[campo], tipo);
	}
	return f as Fila;
};

if (import.meta.url === `file://${process.argv[1]}`) {
	const archivo = process.argv[2];
	if (!archivo) {
		throw new Error("Uso: node equipos-csv.ts ARCHIVO.json");
	}
	const L = JSON.parse(readFileSync(archivo, "utf8"));
	let previas: Fila[] = [];
	try {
		previas = leerEquipos();
	} catch {
		// primera vez
	}
	const filas = L.teams.map((t: any) =>
		filaDeEquipo(t, L.gameAttributes, previas.find((p) => p.tid === String(t.tid) && "club" in p)),
	);
	escribirEquipos(filas);
	console.log(`equipos.csv: ${filas.length} equipos`);
}
