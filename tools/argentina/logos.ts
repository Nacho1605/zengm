// Actualiza Logo URL y Small Logo de equipos puntuales. Uso:
//
//   node tools/argentina/logos.ts ENTRADA.json SALIDA.json

import { readFileSync, writeFileSync } from "node:fs";

const [input, output] = process.argv.slice(2);
if (!input || !output) {
	throw new Error("Uso: node logos.ts ENTRADA.json SALIDA.json");
}

// Abreviatura -> logo (se usa para Logo URL y Small Logo)
const LOGOS: Record<string, string> = {
	ATL: "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0b/C.a._atlanta.png/330px-C.a._atlanta.png",
	ALM: "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/50/Almagro_escudo2024.png/330px-Almagro_escudo2024.png",
	ARM: "https://upload.wikimedia.org/wikipedia/commons/e/e5/Escudo_de_Deportivo_Armenio.png",
	FCO: "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2f/Escudo_club_ferro_c_oeste.svg/330px-Escudo_club_ferro_c_oeste.svg.png",
	OLI: "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ea/EscudoOlimpo.svg/250px-EscudoOlimpo.svg.png",
	SRE: "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e6/Sarmiento_%28Resistencia%29.png/330px-Sarmiento_%28Resistencia%29.png",
};

const league = JSON.parse(readFileSync(input, "utf8"));
for (const [abbrev, url] of Object.entries(LOGOS)) {
	const t = league.teams.find((t2: any) => t2.abbrev === abbrev);
	if (!t) {
		throw new Error(`No existe el equipo ${abbrev}`);
	}
	t.imgURL = url;
	t.imgURLSmall = url;
	for (const s of t.seasons ?? []) {
		s.imgURL = url;
		s.imgURLSmall = url;
	}
	console.log(`${abbrev} ${t.region} ${t.name}: logo actualizado`);
}

writeFileSync(output, JSON.stringify(league));
