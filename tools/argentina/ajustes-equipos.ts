// Ajustes puntuales de equipos pedidos a mano. Uso:
//
//   node tools/argentina/ajustes-equipos.ts ENTRADA.json SALIDA.json
//
// Cambia divisiones, abreviaturas y apodos. También actualiza las filas de
// temporada de cada equipo (las de los equipos activos guardan nombre,
// abreviatura y división).

import { readFileSync, writeFileSync } from "node:fs";

const [input, output] = process.argv.slice(2);
if (!input || !output) {
	throw new Error("Uso: node ajustes-equipos.ts ENTRADA.json SALIDA.json");
}

const league = JSON.parse(readFileSync(input, "utf8"));
const ga = league.gameAttributes;
const divs: any[] = Array.isArray(ga.divs[0]?.value)
	? ga.divs.at(-1).value
	: ga.divs;

// Abreviatura -> nueva división
const DIVISIONES: Record<string, string> = {
	YUP: "Capital Federal",
	RPI: "Conurbano", // Pilar
	FEN: "Conurbano", // Marcos Paz
	ATS: "Conurbano", // General Rodríguez
	LNA: "Conurbano", // General Rodríguez
};

// Abreviatura vieja -> nueva
const ABREVIATURAS: Record<string, string> = {
	MUÑ: "MUN",
};

// Abreviatura -> nuevo apodo
const APODOS: Record<string, string> = {
	ALL: "Lilywhites",
	TAL: "Matadors",
	MIT: "Yellowjackets",
	BUC: "Rivermen",
	HLH: "Flyers",
	CDC: "Shipwrecks",
	BZT: "Orange",
	VSC: "Sky",
	DOU: "Boilermakers",
	SMM: "Aggies",
	EXC: "Ramblers",
	FEN: "Phoenix",
};

const find = (abbrev: string) => {
	const t = league.teams.find((t2: any) => t2.abbrev === abbrev);
	if (!t) {
		throw new Error(`No existe el equipo ${abbrev}`);
	}
	return t;
};
const update = (t: any, fields: Record<string, unknown>) => {
	Object.assign(t, fields);
	for (const s of t.seasons ?? []) {
		Object.assign(s, fields);
	}
};

for (const [abbrev, name] of Object.entries(DIVISIONES)) {
	const div = divs.find((d) => d.name === name);
	const t = find(abbrev);
	update(t, { did: div.did, cid: div.cid });
	console.log(`${abbrev} ${t.region} ${t.name} -> ${name}`);
}

for (const [oldAbbrev, newAbbrev] of Object.entries(ABREVIATURAS)) {
	const t = find(oldAbbrev);
	update(t, { abbrev: newAbbrev });
	console.log(`${oldAbbrev} -> ${newAbbrev}`);
}

for (const [abbrev, name] of Object.entries(APODOS)) {
	const t = find(abbrev);
	console.log(`${abbrev} ${t.region} ${t.name} -> ${name}`);
	update(t, { name });
}

writeFileSync(output, JSON.stringify(league));
