// Agrega al archivo de liga las clases de draft futuras generadas con
// src/worker/core/player/generarDrafts.tool.test.ts. Uso:
//
//   node tools/argentina/agregar-drafts.ts LIGA.json PROSPECTOS.json SALIDA.json
//
// Cada clase tiene 65 prospectos, la cantidad que exige el juego con 28-30
// equipos, así que el juego oficial no genera prospectos al azar para esos
// años. Los prospectos que ya había en el archivo para esos años se reemplazan.

import { readFileSync, writeFileSync } from "node:fs";

const [input, prospectsFile, output] = process.argv.slice(2);
if (!input || !prospectsFile || !output) {
	throw new Error(
		"Uso: node agregar-drafts.ts LIGA.json PROSPECTOS.json SALIDA.json",
	);
}

const league = JSON.parse(readFileSync(input, "utf8"));
const prospects = JSON.parse(readFileSync(prospectsFile, "utf8"));

const years = new Set(prospects.map((p: any) => p.draft.year));
const before = league.players.length;
league.players = league.players.filter(
	(p: any) => !(p.tid === -2 && years.has(p.draft.year)),
);
const removed = before - league.players.length;

for (const p of prospects) {
	delete p.pid;
	league.players.push(p);
}

const sortedYears = [...years].sort();
console.log(
	`Clases ${sortedYears[0]}-${sortedYears.at(-1)}: ${prospects.length} prospectos agregados, ${removed} reemplazados`,
);

writeFileSync(output, JSON.stringify(league));
