// Lectura y escritura de los planteles (data/argentina/planteles/EQUIPO.json)
// con el formato de siempre: tabs, y los arreglos que estaban en una línea
// siguen en una línea (así el cambio en el repositorio es solo el dato).

import { readFileSync, writeFileSync } from "node:fs";

export const DIR_PLANTELES = new URL("../../data/argentina/planteles/", import.meta.url);

export const norm = (s: string) =>
	s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

export const leerPlantel = (equipo: string) => {
	const ruta = new URL(`${equipo}.json`, DIR_PLANTELES);
	const original = readFileSync(ruta, "utf8");
	return { ruta, original, d: JSON.parse(original) };
};

export const escribirPlantel = (ruta: URL, original: string, d: any) => {
	const enLinea = new Set(original.match(/"\w+": \[[^\[\]\n]*\]/g) ?? []);
	let t = JSON.stringify(d, null, "\t") + "\n";
	t = t.replace(/"(\w+)": \[\n(\t+)((?:"[^"\n]*",?\n\t+)+)\]/g, (m, k, _tab, cuerpo) => {
		const items = cuerpo.split("\n").map((x: string) => x.trim().replace(/,$/, "")).filter(Boolean);
		const corto = `"${k}": [${items.join(", ")}]`;
		return enLinea.has(corto) ? corto : m;
	});
	writeFileSync(ruta, t);
};

// Nombre como lo muestra la escalera ("Rick" si no tiene apellido)
export const nombreCompleto = (j: any) => (j.apellido ? `${j.nombre} ${j.apellido}` : j.nombre);
