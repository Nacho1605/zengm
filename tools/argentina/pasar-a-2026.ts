// Pasa el archivo de liga de 2023 a 2026 (versión 2). Uso:
//
//   node tools/argentina/pasar-a-2026.ts ENTRADA.json SALIDA.json
//
// - Temporada 2026: configuración, filas de temporada de los equipos, ratings,
//   contratos, selecciones de draft y transacciones avanzan 3 años. Los
//   contratos conservan los años que les quedaban.
// - Los años de nacimiento reales no cambian: los jugadores tienen 3 años más.
// - Las lesiones de 2023 ya están curadas.
// - Clases de draft 2023, 2024 y 2025: los prospectos generados se borran, y
//   los reales (Echeverri, Barco, Prestianni...) pasan a ser libres hasta que
//   se carguen los planteles 2026.
// - Presupuestos iguales para todos (nivel 34, el neutro del juego).
// - Lesiones de fútbol (ver lesiones.ts).

import { readFileSync, writeFileSync } from "node:fs";
import { INJURY_RATE, LESIONES } from "./lesiones.ts";

const [input, output] = process.argv.slice(2);
if (!input || !output) {
	throw new Error("Uso: node pasar-a-2026.ts ENTRADA.json SALIDA.json");
}

const DESDE = 2023;
const HASTA = 2026;
const SALTO = HASTA - DESDE;
const NIVEL_NEUTRO = 34; // DEFAULT_LEVEL del juego: efecto 0

const league = JSON.parse(readFileSync(input, "utf8"));
const ga = league.gameAttributes;
if (ga.season !== DESDE) {
	throw new Error(`El archivo está en ${ga.season}, no en ${DESDE}`);
}

// Configuración
ga.season = HASTA;
ga.startingSeason = HASTA;
ga.gracePeriodEnd = HASTA + 2;
for (const value of Object.values(ga)) {
	// Ajustes con historial: [{start, value}, ...]
	if (
		Array.isArray(value) &&
		value.length > 0 &&
		value.every(
			(row: any) =>
				row && typeof row === "object" && "start" in row && "value" in row,
		)
	) {
		for (const row of value as any[]) {
			if (row.start === DESDE) {
				row.start = HASTA;
			}
		}
	}
}

// Equipos
for (const t of league.teams) {
	for (const s of t.seasons ?? []) {
		if (s.season === DESDE) {
			s.season = HASTA;
		}
	}
	for (const key of ["scouting", "coaching", "health", "facilities"]) {
		t.budget[key] = NIVEL_NEUTRO;
		t.initialBudget[key] = NIVEL_NEUTRO;
	}
}

// Selecciones de draft (2023-2027 pasan a 2026-2030)
for (const dp of league.draftPicks) {
	dp.season += SALTO;
}

for (const e of league.events ?? []) {
	if (e.season === DESDE) {
		e.season = HASTA;
	}
}

// Jugadores
const clasesViejas = (p: any) => p.tid === -2 && p.draft.year < HASTA;
const esReal = (p: any) => Boolean(p.imgURL);
const borrados: any[] = [];
const aLibres: any[] = [];
league.players = league.players.filter((p: any) => {
	if (clasesViejas(p)) {
		if (esReal(p)) {
			p.tid = -1;
			delete p.contractDemand; // el juego le calcula uno nuevo
			aLibres.push(p);
		} else {
			borrados.push(p);
			return false;
		}
	}
	return true;
});

const shift = (obj: any, key: string) => {
	if (obj && typeof obj[key] === "number" && obj[key] >= DESDE) {
		obj[key] += SALTO;
	}
};
for (const p of league.players) {
	if (p.tid === -3 || p.tid === -2) {
		continue; // retirados: historia; prospectos 2026-2055: ya están bien
	}
	for (const r of p.ratings) {
		if (r.season === DESDE) {
			r.season = HASTA;
		}
	}
	for (const s of p.stats ?? []) {
		if (s.season === DESDE) {
			s.season = HASTA;
		}
	}
	for (const c of p.contracts ?? []) {
		shift(c, "start");
		shift(c.endedEarly, "season");
	}
	shift(p.contractDemand, "exp");
	for (const tr of p.transactions ?? []) {
		if (tr.season === DESDE) {
			tr.season = HASTA;
		}
	}
	p.injury = { type: "Healthy", gamesRemaining: 0 };
	p.gamesUntilTradable = 0;
}

// Lesiones
ga.injuries = LESIONES;
ga.injuryRate = INJURY_RATE;

// Controles
const errores: string[] = [];
const cuenta = (xs: any[], f: (x: any) => any) =>
	xs.reduce((m, x) => ((m[f(x)] = (m[f(x)] ?? 0) + 1), m), {});
const activos = league.teams.filter((t: any) => !t.disabled);
for (const t of activos) {
	if (!t.seasons.some((s: any) => s.season === HASTA)) {
		errores.push(`${t.abbrev} sin fila de temporada ${HASTA}`);
	}
}
for (const p of league.players.filter((p: any) => p.tid >= 0)) {
	const c = p.contracts.at(-1);
	if (!c || c.endedEarly || c.start + c.amounts.length - 1 < HASTA) {
		errores.push(`${p.firstName} ${p.lastName} sin contrato vigente`);
	}
	if (p.ratings.at(-1).season !== HASTA) {
		errores.push(`${p.firstName} ${p.lastName} sin ratings ${HASTA}`);
	}
}
const porClase = cuenta(
	league.players.filter((p: any) => p.tid === -2),
	(p) => p.draft.year,
);
if (Math.min(...(Object.keys(porClase).map(Number) as number[])) !== HASTA) {
	errores.push("Las clases de draft no empiezan en 2026");
}
const textoFinal = JSON.stringify({ ...league, players: [] });
for (const year of [2023, 2024, 2025]) {
	if (
		league.draftPicks.some((dp: any) => dp.season === year) ||
		textoFinal.includes(`"season":${year},"gp"`)
	) {
		errores.push(`Quedan datos de ${year}`);
	}
}
if (errores.length > 0) {
	throw new Error(errores.join("\n"));
}

console.log(`Temporada ${HASTA}, período de gracia hasta ${ga.gracePeriodEnd}`);
console.log(
	`Prospectos generados borrados (clases ${DESDE}-${HASTA - 1}): ${borrados.length}`,
);
console.log(
	`Prospectos reales que pasan a libres: ${aLibres.length} (${aLibres.map((p) => `${p.firstName} ${p.lastName}`).join(", ")})`,
);
console.log(
	"Picks por temporada:",
	JSON.stringify(cuenta(league.draftPicks, (dp) => dp.season)),
);
console.log(
	"Contratos de jugadores con equipo, último año:",
	JSON.stringify(
		cuenta(
			league.players.filter((p: any) => p.tid >= 0),
			(p) => p.contracts.at(-1).start + p.contracts.at(-1).amounts.length - 1,
		),
	),
);
console.log(
	"Clases de draft:",
	Object.keys(porClase)[0],
	"a",
	Object.keys(porClase).at(-1),
	"| por clase:",
	JSON.stringify([...new Set(Object.values(porClase))]),
);
console.log(
	"Libres:",
	league.players.filter((p: any) => p.tid === -1).length,
	JSON.stringify(
		cuenta(
			league.players.filter((p: any) => p.tid === -1),
			(p) => p.pos,
		),
	),
);

writeFileSync(output, JSON.stringify(league));
