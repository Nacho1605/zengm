// Completa las clases de draft del archivo de liga hasta la cantidad que exige
// el juego, con prospectos generados con normas por posición. Uso:
//
//   node tools/argentina/completar-drafts.ts LIGA.json PROSPECTOS.json SALIDA.json
//
// El juego necesita round(2 x equipos activos x 7 / 6) prospectos por clase
// (70 con 30 equipos). Si faltan, agrega jugadores al azar, sin normas y sin
// posición fija. Este script saca esos prospectos al azar (los que no tienen
// posición fija) y completa cada clase con prospectos de PROSPECTOS.json.

import { readFileSync, writeFileSync } from "node:fs";

const [input, prospectsFile, output] = process.argv.slice(2);
if (!input || !prospectsFile || !output) {
	throw new Error(
		"Uso: node completar-drafts.ts LIGA.json PROSPECTOS.json SALIDA.json",
	);
}

const league = JSON.parse(readFileSync(input, "utf8"));
const pool = JSON.parse(readFileSync(prospectsFile, "utf8"));

const numActive = league.teams.filter((t: any) => !t.disabled).length;
const porClase = Math.round((2 * numActive * 7) / 6);

const before = league.players.length;
league.players = league.players.filter(
	(p: any) => !(p.tid === -2 && typeof p.pos !== "string"),
);
console.log(
	`Prospectos al azar (sin posición fija) quitados: ${before - league.players.length}`,
);

const years = [
	...new Set(
		league.players
			.filter((p: any) => p.tid === -2)
			.map((p: any) => p.draft.year as number),
	),
].sort();

let added = 0;
for (const year of years) {
	const count = league.players.filter(
		(p: any) => p.tid === -2 && p.draft.year === year,
	).length;
	const candidates = pool.filter((p: any) => p.draft.year === year);
	const needed = porClase - count;
	if (needed > candidates.length) {
		throw new Error(
			`Clase ${year}: faltan ${needed} prospectos y hay ${candidates.length} generados`,
		);
	}
	for (const p of candidates.slice(0, Math.max(needed, 0))) {
		delete p.pid;
		league.players.push(p);
		added += 1;
	}
}

console.log(
	`Clases ${years[0]}-${years.at(-1)}: ${added} prospectos agregados, ${porClase} por clase`,
);

writeFileSync(output, JSON.stringify(league));
