// Actualiza los equipos activos del archivo de liga a la Liga Profesional 2026.
// Uso:
//
//   node tools/argentina/equipos-2026.ts ENTRADA.json SALIDA.json
//
// - Activa los clubes que juegan en 2026 y estaban desactivados.
// - Desactiva los que no juegan en 2026. Sus jugadores pasan a ser libres hasta
//   que se carguen los planteles 2026.
// - Agrega Deportivo Riestra, que no estaba en el archivo.
// Las zonas (Metropolitana / Federal) y las divisiones regionales quedan como
// estaban en el archivo.

import { readFileSync, writeFileSync } from "node:fs";

const [input, output] = process.argv.slice(2);
if (!input || !output) {
	throw new Error("Uso: node equipos-2026.ts ENTRADA.json SALIDA.json");
}

const league = JSON.parse(readFileSync(input, "utf8"));

// Los 30 clubes de 2026, por su abreviatura en el archivo
const EQUIPOS_2026 = [
	// Metropolitana: Ciudad de Buenos Aires
	"ARG",
	"BAR",
	"BOC",
	"RIE",
	"HUR",
	"RIV",
	"SLO",
	"VEL",
	// Metropolitana: Conurbano
	"BAN",
	"DYJ",
	"IND",
	"LAN",
	"PLA",
	"RAC",
	"TIG",
	// Federal: Córdoba
	"BEL",
	"ERC",
	"INS",
	"TAL",
	// Federal: Santa Fe
	"NOB",
	"ROS",
	"UNI",
	// Federal: interior de Buenos Aires y La Plata
	"ALD",
	"SAR",
	"EST",
	"GIM",
	// Federal: Mendoza
	"GEM",
	"IRM",
	// Federal: Santiago del Estero y Tucumán
	"CCO",
	"ATU",
];

// Deportivo Riestra: nuevo equipo, armado sobre la base de Barracas Central
// (otro club chico de Capital). Nombre al estilo del resto del archivo:
// barrio + apodo en inglés ("Malevo").
const base = league.teams.find((t: any) => t.abbrev === "BAR");
if (!league.teams.some((t: any) => t.abbrev === "RIE")) {
	const tid = Math.max(...league.teams.map((t: any) => t.tid)) + 1;
	const riestra = {
		...structuredClone(base),
		tid,
		region: "Bajo Flores",
		name: "Rogues",
		abbrev: "RIE",
		colors: ["#000000", "#ffffff", "#808080"],
		imgURL: "",
		imgURLSmall: "",
		pop: base.pop,
		stadiumCapacity: 3000,
		retiredJerseyNumbers: [],
		disabled: false,
	};
	riestra.seasons = base.seasons.map((s: any) => ({
		...structuredClone(s),
		tid,
		region: riestra.region,
		name: riestra.name,
		abbrev: riestra.abbrev,
		colors: riestra.colors,
		imgURL: riestra.imgURL,
		imgURLSmall: riestra.imgURLSmall,
		stadiumCapacity: riestra.stadiumCapacity,
	}));
	riestra.stats = [];
	league.teams.push(riestra);
	console.log(`Agregado: RIE (tid ${tid}) ${riestra.region} ${riestra.name}`);
}

const activos = new Set(EQUIPOS_2026);
for (const abbrev of activos) {
	if (!league.teams.some((t: any) => t.abbrev === abbrev)) {
		throw new Error(`Falta el equipo ${abbrev} en el archivo`);
	}
}

for (const t of league.teams) {
	const disabled = !activos.has(t.abbrev);
	if (t.disabled !== disabled) {
		console.log(`${disabled ? "Desactivado" : "Activado"}: ${t.abbrev}`);
	}
	t.disabled = disabled;

	if (disabled) {
		const players = league.players.filter((p: any) => p.tid === t.tid);
		for (const p of players) {
			p.tid = -1;
		}
		if (players.length > 0) {
			console.log(
				`  ${players.length} jugadores de ${t.abbrev} pasan a libres`,
			);
		}
	}
}

// Filas de temporada: un equipo desactivado no puede tener fila para la
// temporada actual (el juego falla: "No payroll found for team"), y un equipo
// activado la necesita
const startSeason = league.startingSeason ?? league.gameAttributes.season;
const baseRow = base.seasons.find((s: any) => s.season === startSeason);
for (const t of league.teams) {
	t.seasons ??= [];
	if (t.disabled) {
		t.seasons = t.seasons.filter((s: any) => s.season < startSeason);
	} else if (!t.seasons.some((s: any) => s.season === startSeason)) {
		t.seasons.push({
			...structuredClone(baseRow),
			tid: t.tid,
			cid: t.cid,
			did: t.did,
			region: t.region,
			name: t.name,
			abbrev: t.abbrev,
			colors: t.colors,
			jersey: t.jersey,
			imgURL: t.imgURL,
			imgURLSmall: t.imgURLSmall,
			pop: t.pop,
			stadiumCapacity: t.stadiumCapacity,
		});
		console.log(`Fila de temporada ${startSeason} agregada: ${t.abbrev}`);
	}
}

// Selecciones de draft: las de los equipos desactivados se borran, y los
// equipos activados reciben las suyas (el juego falla con selecciones de
// equipos desactivados: "No payroll found for team")
const disabledTids = new Set(
	league.teams.filter((t: any) => t.disabled).map((t: any) => t.tid),
);
const activeTids = league.teams
	.filter((t: any) => !t.disabled)
	.map((t: any) => t.tid);
league.draftPicks = league.draftPicks.filter(
	(dp: any) => !disabledTids.has(dp.tid) && !disabledTids.has(dp.originalTid),
);
const pickSlots = new Set(
	league.draftPicks.map((dp: any) => `${dp.season}-${dp.round}`),
);
let dpid = Math.max(0, ...league.draftPicks.map((dp: any) => dp.dpid)) + 1;
for (const tid of activeTids) {
	for (const slot of pickSlots) {
		const [season, round] = (slot as string).split("-").map(Number);
		const has = league.draftPicks.some(
			(dp: any) =>
				dp.originalTid === tid && dp.season === season && dp.round === round,
		);
		if (!has) {
			league.draftPicks.push({
				tid,
				originalTid: tid,
				round,
				pick: 0,
				season,
				dpid,
			});
			dpid += 1;
		}
	}
}
if (league.releasedPlayers) {
	league.releasedPlayers = league.releasedPlayers.filter(
		(rp: any) => !disabledTids.has(rp.tid),
	);
}

// Planteles provisorios: los equipos sin jugadores reciben los mejores libres,
// repartidos por posición, hasta que se carguen los planteles 2026
const CUPOS: Record<string, number> = {
	C: 2,
	GF: 2,
	PF: 2,
	FC: 2,
	G: 2,
	SG: 2,
	PG: 1,
	SF: 2,
	F: 2,
};
const season = league.startingSeason ?? league.gameAttributes.season;
const ovrOf = (p: any) => p.ratings.at(-1).ovr;
for (const tid of activeTids) {
	if (league.players.some((p: any) => p.tid === tid)) {
		continue;
	}
	const abbrev = league.teams.find((t: any) => t.tid === tid).abbrev;
	let count = 0;
	for (const [pos, cupo] of Object.entries(CUPOS)) {
		const libres = league.players
			.filter((p: any) => p.tid === -1 && p.pos === pos)
			.sort((a: any, b: any) => ovrOf(b) - ovrOf(a))
			.slice(0, cupo);
		for (const p of libres) {
			p.tid = tid;
			p.contract = {
				amount: p.contract?.amount ?? league.gameAttributes.minContract,
				exp: Math.max(p.contract?.exp ?? 0, season + 1),
			};
			count += 1;
		}
	}
	console.log(`Plantel provisorio para ${abbrev}: ${count} jugadores libres`);
}

const porZona: Record<number, number> = {};
for (const t of league.teams.filter((t: any) => !t.disabled)) {
	porZona[t.cid] = (porZona[t.cid] ?? 0) + 1;
}
console.log("Equipos activos por zona:", JSON.stringify(porZona));

writeFileSync(output, JSON.stringify(league));
