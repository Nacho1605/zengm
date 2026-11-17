// Agrega como inactivos a los clubes ya clasificados al Torneo Argentino del
// Interior 2027 (cuarta división; 10 de 64 confirmados a noviembre de 2026).
// Uso:
//
//   node tools/argentina/equipos-interior.ts ENTRADA.json SALIDA.json
//
// Apodos, colores, logos, estadio y población son provisorios: los completa el
// usuario. Cada club va a la división regional de su provincia.
//
// También: Colón vuelve a ser "Santa Fe Fishermen", porque Huracán de Goya usa
// "Shads".

import { readFileSync, writeFileSync } from "node:fs";

const [input, output] = process.argv.slice(2);
if (!input || !output) {
	throw new Error("Uso: node equipos-interior.ts ENTRADA.json SALIDA.json");
}

const league = JSON.parse(readFileSync(input, "utf8"));

// [abreviatura, ciudad, apodo provisorio, club, club de referencia para la
// división]
const EQUIPOS: [string, string, string, string, string][] = [
	[
		"AHZ",
		"Palpalá",
		"Steelers",
		"Asociación Cultural y Deportiva Altos Hornos Zapla",
		"GJU",
	],
	["DES", "San Juan", "Vipers", "Club Sportivo Desamparados", "SMJ"],
	[
		"JUG",
		"Gualeguaychú",
		"Elders",
		"Club Deportivo Juventud Unida (Gualeguaychú)",
		"PAT",
	],
	["CON", "Concepción", "Cobras", "Concepción Fútbol Club", "ATU"],
	["PAC", "General Alvear", "Mariners", "Sport Club Pacífico", "GEM"],
	["CSJ", "San Justo", "Reds", "Club Colón (San Justo)", "UNI"],
	["HGO", "Goya", "Shads", "Huracán Football Club (Goya)", "BUC"],
	["RAO", "Olavarría", "Chargers", "Racing Atletic Club (Olavarría)", "OLI"],
	[
		"HIW",
		"Ingeniero White",
		"Harbormen",
		"Club Atlético Huracán (Ingeniero White)",
		"OLI",
	],
	[
		"MSF",
		"San Francisco de Laishí",
		"Municipals",
		"Club Municipal de San Francisco de Laishí",
		"SMF",
	],
];

const plantilla = league.teams.find((t: any) => t.abbrev === "GCU");
let tid = Math.max(...league.teams.map((t: any) => t.tid)) + 1;
for (const [abbrev, region, name, club, ref] of EQUIPOS) {
	if (league.teams.some((t: any) => t.abbrev === abbrev)) {
		console.log(`${abbrev} ya existe`);
		continue;
	}
	const referencia = league.teams.find((t: any) => t.abbrev === ref);
	league.teams.push({
		...structuredClone(plantilla),
		tid,
		cid: referencia.cid,
		did: referencia.did,
		region,
		name,
		abbrev,
		imgURL: "",
		imgURLSmall: "",
		colors: ["#808080", "#ffffff", "#000000"],
		pop: 0.1,
		stadiumCapacity: 5000,
		retiredJerseyNumbers: [],
		disabled: true,
		seasons: [],
		stats: [],
	});
	console.log(`Agregado: ${abbrev} (tid ${tid}) ${region} ${name} — ${club}`);
	tid += 1;
}

const colon = league.teams.find((t: any) => t.abbrev === "COL");
colon.name = "Fishermen";
for (const s of colon.seasons ?? []) {
	s.name = "Fishermen";
}

writeFileSync(output, JSON.stringify(league));
