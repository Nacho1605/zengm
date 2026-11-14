// Carga los planteles reales desde data/argentina/planteles/XXX.json. Uso:
//
//   node tools/argentina/cargar-plantel.ts ENTRADA.json SALIDA.json RIE.json [OTRO.json ...]
//
// Los planteles se cargan en el orden dado, siempre sobre la v2.0, para que el
// orden de los picks del draft sea reproducible.
//
// - Planteles de 22 a 36 jugadores (en 2026, Belgrano tiene 25 y Platense 36).
// - Los jugadores que hoy tiene el equipo pasan a ser libres.
// - Los jugadores de "reemplaza" se borran del archivo (se crean de nuevo, sin
//   historial).
// - Cada jugador nuevo: posición fija según Transfermarkt, altura real, rating
//   hgt según la regla de tres (156 cm = 0, 200 cm = 100), contrato con la
//   escala comprimida y ratings con la norma de su posición (la misma de los
//   prospectos, ver genRatingsFutbol.ts), ajustados para que el OVR oficial dé
//   exactamente el OVR buscado.
// - Draft y College:
//   - Debut en un club de la base: draft de ese club en el año de debut. Los
//     picks de cada año van en orden de carga (dentro de cada plantel, del
//     mejor al peor OVR), 30 por ronda. College: el club de inferiores, si es
//     otro.
//   - Debut en el exterior o en un club que no está en la base: sin draft, y
//     ese club va como College.
//
// OVR buscado: el que diga el plantel ("ovr") o, si no hay, la fórmula de
// ovrSugerido() (valor de mercado, minutos jugados y edad).

import { readFileSync, writeFileSync } from "node:fs";

const [input, output, ...plantelFiles] = process.argv.slice(2);
if (!input || !output || plantelFiles.length === 0) {
	throw new Error(
		"Uso: node cargar-plantel.ts ENTRADA.json SALIDA.json PLANTEL.json [...]",
	);
}

const league = JSON.parse(readFileSync(input, "utf8"));
const ga = league.gameAttributes;
const SEASON: number = ga.season;
ga.minRosterSize = 22;
ga.maxRosterSize = 36;

type Key =
	| "hgt"
	| "stre"
	| "spd"
	| "jmp"
	| "endu"
	| "ins"
	| "dnk"
	| "ft"
	| "fg"
	| "tp"
	| "oiq"
	| "diq"
	| "drb"
	| "pss"
	| "reb";
const KEYS: Key[] = [
	"hgt",
	"stre",
	"spd",
	"jmp",
	"endu",
	"ins",
	"dnk",
	"ft",
	"fg",
	"tp",
	"oiq",
	"diq",
	"drb",
	"pss",
	"reb",
];
type Ratings = Record<Key, number>;

// OVR oficial de BBGM (src/worker/core/player/ovr.basketball.ts)
const ovrOficial = (r: Ratings) => {
	const x =
		0.159 * (r.hgt - 47.5) +
		0.0777 * (r.stre - 50.2) +
		0.123 * (r.spd - 50.8) +
		0.051 * (r.jmp - 48.7) +
		0.0632 * (r.endu - 39.9) +
		0.0126 * (r.ins - 42.4) +
		0.0286 * (r.dnk - 49.5) +
		0.0202 * (r.ft - 47.0) +
		0.0726 * (r.tp - 47.1) +
		0.133 * (r.oiq - 46.8) +
		0.159 * (r.diq - 46.7) +
		0.059 * (r.drb - 54.8) +
		0.062 * (r.pss - 51.3) +
		0.01 * (r.fg - 47.0) +
		0.01 * (r.reb - 51.4) +
		48.5;
	let fudge;
	if (x >= 68) {
		fudge = 8;
	} else if (x >= 50) {
		fudge = 4 + (x - 50) * (4 / 18);
	} else if (x >= 42) {
		fudge = -5 + (x - 42) * (9 / 8);
	} else if (x >= 31) {
		fudge = -5 - (42 - x) * (5 / 11);
	} else {
		fudge = -10;
	}
	return Math.min(100, Math.max(0, Math.round(x + fudge)));
};

// Posición de Transfermarkt -> posición fija del juego
const posicion = (tm: string, pie: string | null) => {
	switch (tm) {
		case "Portero":
			return "C";
		case "Defensa central":
			// #2 = central de pie derecho, #6 = central de pie izquierdo
			return pie === "Izquierdo" || pie === "Ambidiestro" ? "PF" : "FC";
		case "Lateral izquierdo":
		case "Lateral derecho":
			return "GF";
		case "Pivote":
			return "G";
		case "Mediocentro":
		case "Interior derecho":
		case "Interior izquierdo":
			return "SG";
		case "Mediocentro ofensivo":
		case "Mediapunta":
			return "PG";
		case "Extremo izquierdo":
		case "Extremo derecho":
			return "SF";
		case "Delantero centro":
		case "Segundo delantero":
			return "F";
	}
	throw new Error(`Posición desconocida: ${tm}`);
};

// Norma de cada posición: los mismos multiplicadores de
// FUTBOL_POSITION_PROFILES (src/worker/core/player/genRatingsFutbol.ts),
// convertidos en sumas y restas (ver ESCALA_NORMA)
const NORMA: Record<string, Partial<Record<Key, number>>> = {
	C: {
		jmp: 1.5,
		diq: 1.5,
		reb: 1.7,
		stre: 1.1,
		spd: 0.8,
		oiq: 0.5,
		drb: 0.5,
		pss: 0.6,
		ft: 0.6,
	},
	GF: {
		spd: 1.4,
		endu: 1.4,
		diq: 1.2,
		tp: 0.8,
		ins: 0.6,
		dnk: 0.6,
		fg: 0.8,
	},
	PF: {
		diq: 1.5,
		stre: 1.2,
		jmp: 1.2,
		reb: 1.3,
		spd: 0.9,
		drb: 0.6,
		oiq: 0.7,
		ins: 0.6,
		dnk: 0.6,
		fg: 0.5,
		tp: 0.4,
	},
	FC: {
		diq: 1.5,
		stre: 1.4,
		jmp: 1.3,
		reb: 1.4,
		pss: 0.8,
		spd: 0.85,
		drb: 0.5,
		oiq: 0.6,
		ins: 0.6,
		dnk: 0.6,
		fg: 0.5,
		tp: 0.4,
	},
	G: {
		diq: 1.4,
		endu: 1.3,
		stre: 1.2,
		pss: 1.2,
		oiq: 0.9,
		drb: 0.9,
		tp: 0.8,
		ins: 0.6,
		dnk: 0.6,
	},
	SG: {
		endu: 1.4,
		pss: 1.2,
		drb: 1.1,
		diq: 1.1,
		oiq: 1.1,
	},
	PG: {
		pss: 1.6,
		oiq: 1.5,
		drb: 1.4,
		tp: 1.2,
		fg: 1.2,
		ft: 1.2,
		diq: 0.7,
		stre: 0.8,
		reb: 0.7,
	},
	SF: {
		spd: 1.65,
		drb: 1.5,
		jmp: 1.2,
		tp: 1.1,
		diq: 0.7,
		stre: 0.8,
		reb: 0.7,
	},
	F: {
		ins: 1.6,
		dnk: 1.5,
		fg: 1.3,
		stre: 1.2,
		oiq: 1.2,
		jmp: 1.2,
		tp: 0.9,
		pss: 0.8,
		drb: 0.9,
		diq: 0.6,
	},
};

// Puntos de rating por cada 1,0 de diferencia en el multiplicador
const ESCALA_NORMA = 30;

// Los arqueros no rematan: tiro en 0
const SIN_TIRO: Key[] = ["ins", "dnk", "fg", "tp"];

const parseFecha = (s: string) => {
	const [d, m, y] = s.split("/").map(Number);
	return { d: d!, m: m!, y: y! };
};

// Generador al azar con semilla (el mismo jugador da siempre los mismos ratings)
const azar = (semilla: string) => {
	let h = 2166136261;
	for (const c of semilla) {
		h = Math.imul(h ^ c.charCodeAt(0), 16777619);
	}
	return () => {
		h = Math.imul(h ^ (h >>> 15), 2246822507);
		h = Math.imul(h ^ (h >>> 13), 3266489909);
		h ^= h >>> 16;
		return (h >>> 0) / 4294967296;
	};
};

const MINUTOS_TEMPORADA = 3330; // 37 partidos completos

// OVR sugerido a partir de los datos de Transfermarkt
export const ovrSugerido = (j: any, edad: number) => {
	const valor = Math.max(j.valor ?? 10000, 10000);
	let cuota = j.min / MINUTOS_TEMPORADA;
	if (j.fichado && parseFecha(j.fichado).m >= 7) {
		cuota *= 2; // llegó a mitad de año: tuvo la mitad de los minutos posibles
	}
	cuota = Math.min(cuota, 1);
	return Math.round(
		36 +
			13 * Math.log10(valor / 10000) +
			4 * (cuota - 0.5) +
			Math.max(0, 0.6 * (edad - 29)),
	);
};

// Escala comprimida: 10 mil € -> mínimo, 15 M€ -> máximo
const sueldo = (valor: number | null) => {
	const c = ga.maxContract / Math.sqrt(15_000_000);
	const amount = Math.round((c * Math.sqrt(valor ?? 0)) / 10) * 10;
	return Math.min(ga.maxContract, Math.max(ga.minContract, amount));
};

const hgtRating = (cm: number) =>
	Math.max(0, Math.min(100, Math.round(((cm - 156) * 100) / 44)));

const generarRatings = (j: any, pos: string, edad: number, ovrMeta: number) => {
	const rand = azar(`${j.nombre} ${j.apellido} ${j.nac}`);
	const cm = Math.round(j.altura * 100);
	const norma = NORMA[pos]!;

	// Ajustes individuales, sobre la norma de la posición
	const ajuste: Partial<Record<Key, number>> = {};
	const sumar = (k: Key, v: number) => {
		ajuste[k] = (ajuste[k] ?? 0) + v;
	};
	sumar("spd", edad > 27 ? -1.2 * (edad - 27) : 0.8 * (27 - edad));
	if (edad > 30) {
		sumar("endu", -1.5 * (edad - 30));
		sumar("jmp", -(edad - 30));
	}
	const experiencia = 0.5 * Math.max(-4, Math.min(10, edad - 24));
	sumar("oiq", experiencia);
	sumar("diq", experiencia);
	sumar("endu", 10 * (Math.min(1, j.min / MINUTOS_TEMPORADA) - 0.5));
	if (j.min >= 300 && pos !== "C") {
		const golesPor90 = (j.goles * 90) / j.min;
		if (["F", "SF", "PG", "SG"].includes(pos)) {
			const gol = Math.max(-6, Math.min(8, (golesPor90 - 0.2) * 25));
			sumar("ins", gol);
			sumar("dnk", gol);
			sumar("fg", gol / 2);
		} else if (j.goles >= 2) {
			// Defensor goleador: juego aéreo
			sumar("jmp", 4);
			sumar("dnk", 4);
			sumar("ins", 3);
		}
	}
	for (const k of KEYS) {
		if (k !== "hgt") {
			sumar(k, (rand() - 0.5) * 6);
		}
	}

	const construir = (base: number): Ratings => {
		const r = { hgt: hgtRating(cm) } as Ratings;
		for (const k of KEYS) {
			if (k === "hgt") {
				continue;
			}
			if (pos === "C" && SIN_TIRO.includes(k)) {
				r[k] = 0;
				continue;
			}
			// La norma suma o resta respecto del nivel base (1,5 -> +15; 0,6 ->
			// -12), así los ratings fuertes de la posición no se clavan en 100
			const v = base + ESCALA_NORMA * ((norma[k] ?? 1) - 1) + (ajuste[k] ?? 0);
			r[k] = Math.max(0, Math.min(100, Math.round(v)));
		}
		return r;
	};

	// Nivel base: búsqueda binaria hasta el OVR buscado
	let lo = 0;
	let hi = 150;
	for (let i = 0; i < 60; i++) {
		const mid = (lo + hi) / 2;
		if (ovrOficial(construir(mid)) < ovrMeta) {
			lo = mid;
		} else {
			hi = mid;
		}
	}
	const r = construir(hi);

	// Retoque fino: el redondeo puede dejarlo a 1 punto
	const llave: Key = ["C", "PF", "FC", "G", "GF"].includes(pos) ? "diq" : "oiq";
	for (let i = 0; i < 20 && ovrOficial(r) !== ovrMeta; i++) {
		r[llave] += ovrOficial(r) < ovrMeta ? 1 : -1;
	}
	if (ovrOficial(r) !== ovrMeta) {
		throw new Error(`${j.nombre} ${j.apellido}: no llega a OVR ${ovrMeta}`);
	}
	return r;
};

// Picks por año de debut: cuántos se asignaron hasta ahora
const picksPorAnio = new Map<number, number>();
const PICKS_POR_RONDA = 30;

const norm = (s: string) =>
	s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

const cargar = (plantel: any) => {
	const team = league.teams.find((t: any) => t.abbrev === plantel.equipo);
	if (!team) {
		throw new Error(`No existe el equipo ${plantel.equipo}`);
	}

	// 1. El plantel actual pasa a ser libre
	const anteriores = league.players.filter((p: any) => p.tid === team.tid);
	for (const p of anteriores) {
		p.tid = -1;
		const c = p.contracts?.at(-1);
		if (c && !c.endedEarly) {
			c.endedEarly = { season: SEASON, phase: ga.phase };
		}
		delete p.contractDemand; // el juego le calcula uno nuevo
	}

	// 2. Borrar las versiones viejas de los jugadores que se crean de nuevo
	const borrados: string[] = [];
	for (const { nombre, nacimiento } of plantel.reemplaza ?? []) {
		const matches = league.players.filter(
			(p: any) =>
				norm(`${p.firstName} ${p.lastName}`) === norm(nombre) &&
				p.born.year === nacimiento,
		);
		if (matches.length !== 1) {
			throw new Error(
				`"${nombre}" (${nacimiento}): ${matches.length} coincidencias`,
			);
		}
		league.players = league.players.filter((p: any) => p !== matches[0]);
		borrados.push(`${nombre} (pid ${matches[0].pid})`);
	}

	// 3. Jugadores nuevos
	let pid = Math.max(...league.players.map((p: any) => p.pid)) + 1;
	const nuevos = [];
	for (const j of plantel.jugadores) {
		const nac = parseFecha(j.nac);
		const edad = SEASON - nac.y;
		const pos = posicion(j.pos, j.pie);
		const ovrMeta = j.ovr ?? ovrSugerido(j, edad);
		const r = generarRatings(j, pos, edad, ovrMeta);
		const exp = j.contrato ? parseFecha(j.contrato).y : SEASON;
		const amount = sueldo(j.valor);
		const cm = j.altura * 100;

		const clubDebut = j.debut?.club
			? league.teams.find((t: any) => t.abbrev === j.debut.club)
			: undefined;
		if (j.debut?.club && !clubDebut) {
			throw new Error(`${j.nombre} ${j.apellido}: no existe ${j.debut.club}`);
		}

		const p: any = {
			pid,
			tid: team.tid,
			firstName: j.nombre,
			lastName: j.apellido,
			pos,
			hgt: Math.round(cm / 2.54),
			weight: Math.round(23.5 * j.altura ** 2 * 2.2046),
			born: { year: nac.y, loc: j.pais },
			college: j.college ?? "",
			draft: {
				round: 0,
				pick: 0,
				tid: clubDebut?.tid ?? -1,
				originalTid: clubDebut?.tid ?? -1,
				year: j.debut?.anio ?? nac.y + 18,
			},
			imgURL: j.imgURL ?? "",
			contracts: [
				{
					type: "unknown",
					start: SEASON,
					amounts: Array.from({ length: exp - SEASON + 1 }, () => amount),
					payments: [],
				},
			],
			ratings: [{ ...r, fuzz: 0, ovr: ovrMeta, pos, season: SEASON }],
			stats: [],
			statsTids: [],
			transactions: [],
			awards: [],
			injuries: [],
			injury: { type: "Healthy", gamesRemaining: 0 },
			relatives: [],
			gamesUntilTradable: 0,
			numDaysFreeAgent: 0,
			ptModifier: 1,
			yearsFreeAgent: 0,
		};
		if (j.n) {
			p.jerseyNumber = j.n;
		}
		nuevos.push({ p, j, edad, amount, exp, clubDebut });
		pid += 1;
	}
	nuevos.sort((a, b) => b.p.ratings[0].ovr - a.p.ratings[0].ovr);
	for (const [i, { p, clubDebut }] of nuevos.entries()) {
		p.rosterOrder = i;
		if (clubDebut) {
			const n = (picksPorAnio.get(p.draft.year) ?? 0) + 1;
			picksPorAnio.set(p.draft.year, n);
			p.draft.round = Math.ceil(n / PICKS_POR_RONDA);
			p.draft.pick = ((n - 1) % PICKS_POR_RONDA) + 1;
		}
		league.players.push(p);
	}

	// Resumen
	console.log(
		`\n${team.region} ${team.name}: ${anteriores.length} jugadores anteriores pasan a libres`,
	);
	console.log(`Borrados (se crean de nuevo): ${borrados.join(", ") || "-"}`);
	let payroll = 0;
	const filas = [];
	for (const { p, j, edad, amount, exp, clubDebut } of nuevos) {
		payroll += amount;
		const r = p.ratings[0];
		const draft = clubDebut
			? `draft ${p.draft.year} R${p.draft.round} P${p.draft.pick} ${clubDebut.abbrev}${clubDebut.disabled ? " (inactivo)" : ""}`
			: `sin draft (${p.draft.year})`;
		filas.push(
			[
				(p.jerseyNumber ?? "-").padStart(2),
				`${p.firstName} ${p.lastName}`.padEnd(20),
				p.pos.padEnd(2),
				String(edad).padStart(2),
				`OVR ${r.ovr}${j.ovr ? "*" : " "}`,
				`$${(amount / 1000).toFixed(2)}M hasta ${exp}`,
				draft,
				`college: ${p.college || "-"}`,
			].join(" | "),
		);
	}
	console.log(filas.join("\n"));
	console.log(
		`${nuevos.length} jugadores, planilla $${(payroll / 1000).toFixed(1)}M (tope $${ga.salaryCap / 1000}M)`,
	);
};

for (const file of plantelFiles) {
	cargar(JSON.parse(readFileSync(file, "utf8")));
}
console.log(
	"\n* OVR indicado en el plantel; el resto, sugerido por la fórmula",
);

writeFileSync(output, JSON.stringify(league));
