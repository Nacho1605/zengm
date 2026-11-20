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

// Economía achicada (para la paridad): con planteles de 30 jugadores, el
// contrato máximo de la NBA ($34M) no entra en ningún tope. Con $10M, los
// sueldos que calcula el juego al renovar alcanzan para los chicos y aprietan
// a los grandes
const CONTRATO_MAXIMO_ANTERIOR: number = ga.maxContract;
ga.maxContract = 10000;
ga.minContract = 1000;

// Tope estricto: aprieta a los clubes más caros, que no pueden renovar ni
// fichar a todos, y deja margen a los chicos. Impuesto al lujo apenas arriba
// del tope (lo pagan los que arrancan pasados) y planilla mínima a la altura
// de los clubes más chicos. Se recalibra a medida que se cargan los planteles.
const ECONOMIA = {
	salaryCapType: "hard",
	salaryCap: 115000,
	luxuryPayroll: 125000,
	minPayroll: 55000,
};
Object.assign(ga, ECONOMIA);

// Ajustes de liga decididos en la fase 2
Object.assign(ga, {
	// Muertes trágicas, pero la mitad de frecuentes que en el juego
	tragicDeathRate: 0.0001,
	// Ventaja de local más fuerte que en el básquet
	homeCourtAdvantage: 2,
	// Partido de las Estrellas sin concursos de volcadas ni de triples
	allStarDunk: false,
	allStarThree: false,
});

// Equipo del usuario por defecto: Rosario Central, elegido por el usuario (al
// crear la liga se puede elegir cualquier
// equipo activo; Colón no, porque en 2026 está inactivo)
{
	const tid = league.teams.find((t: any) => t.abbrev === "ROS").tid;
	ga.userTid = [{ start: null, value: tid }];
	ga.userTids = [tid];
}

// Países: el nombre tiene que ser el del juego para que aparezca la bandera, y
// los que no tienen bandera en el juego (o la tienen vieja) llevan una imagen
const PAISES = {
	renombrar: { "São Tomé and Príncipe": "Sao Tome and Principe" } as Record<
		string,
		string
	>,
	banderas: {
		Syria:
			"https://thumb.wikimedia.org/wikipedia/commons/thumb/5/54/Flag_of_Syria_%282025-%29.svg/1280px-Flag_of_Syria_%282025-%29.svg.png",
	} as Record<string, string>,
};
const bio = ga.playerBioInfo;
for (const [viejo, nuevo] of Object.entries(PAISES.renombrar)) {
	for (const p of league.players) {
		if (p.born?.loc === viejo) {
			p.born.loc = nuevo;
		} else if (p.born?.loc?.endsWith(`, ${viejo}`)) {
			p.born.loc = p.born.loc.replace(`, ${viejo}`, `, ${nuevo}`);
		}
	}
	for (const key of ["countries", "frequencies"]) {
		if (bio?.[key]?.[viejo] !== undefined) {
			bio[key][nuevo] = bio[key][viejo];
			delete bio[key][viejo];
		}
	}
}
for (const [pais, flag] of Object.entries(PAISES.banderas)) {
	bio.countries ??= {};
	bio.countries[pais] = { ...bio.countries[pais], flag };
}

// Los contratos que ya estaban en el archivo (jugadores de 2023) pasan a la
// escala nueva, en la misma proporción entre el mínimo y el máximo
const reescalar = (amount: number) =>
	Math.round(
		(ga.minContract +
			((amount - ga.minContract) * (ga.maxContract - ga.minContract)) /
				(CONTRATO_MAXIMO_ANTERIOR - ga.minContract)) /
			10,
	) * 10;
if (CONTRATO_MAXIMO_ANTERIOR !== ga.maxContract) {
	for (const p of league.players) {
		for (const c of p.contracts ?? []) {
			c.amounts = c.amounts.map((a: number) =>
				Math.min(ga.maxContract, Math.max(ga.minContract, reescalar(a))),
			);
		}
		if (p.contractDemand) {
			delete p.contractDemand; // el juego le calcula uno nuevo
		}
	}
}

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
			// #2 = central de pie derecho; #6 = el resto (zurdo, ambidiestro o sin
			// dato en Transfermarkt), porque en el juego faltan centrales izquierdos
			return pie === "Derecho" ? "FC" : "PF";
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
	// El valor de los menores de 24 incluye lo que se espera que lleguen a ser:
	// se descuenta, más cuanto más joven y más caro (desde 100 mil €; completo
	// desde 10 M€)
	const promesa =
		Math.max(0, 24 - edad) *
		1.5 *
		Math.min(1, Math.max(0, Math.log10(valor / 100000) / 2));
	return Math.round(
		36 +
			13 * Math.log10(valor / 10000) +
			4 * (cuota - 0.5) +
			Math.max(0, 0.6 * (edad - 29)) -
			promesa,
	);
};

// Sueldo inicial: mitad según el valor de mercado (escala comprimida: 10 mil €
// -> mínimo, 15 M€ -> máximo) y mitad según lo que el juego le pagaría por su
// OVR al renovar (genContract, tope estricto, sin azar). Así, al vencer el
// contrato, el sueldo nuevo no da un salto.
const sueldoJuego = (ovr: number) => {
	const amount =
		(ovr / 100 - 0.47) * 1.6 * 1.7 * (ga.maxContract - ga.minContract) +
		ga.minContract;
	return amount < ga.minContract * 1.1
		? ga.minContract
		: Math.min(ga.maxContract, amount);
};
const sueldo = (valor: number | null, ovr: number) => {
	const c = ga.maxContract / Math.sqrt(15_000_000);
	const mercado = Math.min(
		ga.maxContract,
		Math.max(ga.minContract, c * Math.sqrt(valor ?? 0)),
	);
	const amount = Math.round((mercado + sueldoJuego(ovr)) / 2 / 10) * 10;
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
	// Rasgos indicados en el plantel (dan forma, el OVR no cambia)
	if (j.rasgos?.includes("aereo")) {
		// Gran cabeceador
		sumar("jmp", 8);
		sumar("dnk", 5);
		sumar("reb", 4);
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

// Prospectos generados: el rating de altura salía de la fórmula del juego
// (unos 8 puntos por debajo del ancla 156 cm = 0, 200 cm = 100). Se corrige
// con la regla de tres y se recalcula su OVR oficial
{
	let n = 0;
	for (const p of league.players) {
		if (p.tid !== -2) {
			continue;
		}
		for (const r of p.ratings) {
			const hgt = hgtRating(p.hgt * 2.54);
			if (r.hgt !== hgt) {
				r.hgt = hgt;
				r.ovr = ovrOficial(r);
				n += 1;
			}
		}
		if (p.draft?.year === p.ratings[0].season) {
			p.draft.ovr = p.ratings[0].ovr;
		}
	}
	console.log(`Altura de prospectos corregida: ${n}`);
}

// Jugadores borrados y creados de nuevo: pid viejo -> jugador nuevo, para
// que sus parientes apunten al jugador nuevo
const reemplazados = new Map<number, { nombre: string; nacimiento: number }>();

// Picks por año de debut: cuántos se asignaron hasta ahora
const picksPorAnio = new Map<number, number>();
const PICKS_POR_RONDA = 30;

// Nombre completo de cada club, para el College de los que no tienen club de
// inferiores distinto del de debut (el College repite el club que lo "drafteó")
// Lealtad: debut (draft) o College hasta esta temporada inclusive
const ULTIMO_ANIO_LEALTAD = 2021;

const NOMBRE_COMPLETO: Record<string, string> = {
	CHA: "Club Atlético Chacarita Juniors",
	IRM: "Club Sportivo Independiente Rivadavia",
	GEM: "Club Atlético Gimnasia y Esgrima (Mendoza)",
	ERC: "Asociación Atlética Estudiantes (Río Cuarto)",
	CCO: "Club Atlético Central Córdoba (Santiago del Estero)",
	BAR: "Club Atlético Barracas Central",
	ATU: "Club Atlético Tucumán",
	ACA: "Club Atlético Acassuso",
	ALD: "Club Atlético Aldosivi",
	ALL: "Club Atlético All Boys",
	ALM: "Club Almagro",
	ALT: "Club Atlético Almirante Brown",
	AND: "Club Atlético Los Andes",
	ARG: "Asociación Atlética Argentinos Juniors",
	ARS: "Arsenal Fútbol Club",
	ATL: "Club Atlético Atlanta",
	BAN: "Club Atlético Banfield",
	BEL: "Club Atlético Belgrano",
	BOC: "Club Atlético Boca Juniors",
	CIP: "Club Cipolletti",
	COM: "Club Comunicaciones",
	COL: "Club Atlético Colón",
	DME: "Club Social y Deportivo Merlo",
	DOC: "Club Atlético Dock Sud",
	DUN: "Club Atlético Defensores Unidos",
	DYJ: "Club Social y Deportivo Defensa y Justicia",
	EBA: "Club Atlético Estudiantes (Caseros)",
	EST: "Club Estudiantes de La Plata",
	FCO: "Club Ferro Carril Oeste",
	FEN: "Club Atlético Fénix",
	GIM: "Club de Gimnasia y Esgrima La Plata",
	GOD: "Club Deportivo Godoy Cruz Antonio Tomba",
	HUR: "Club Atlético Huracán",
	IND: "Club Atlético Independiente",
	INS: "Instituto Atlético Central Córdoba",
	LAN: "Club Atlético Lanús",
	MOR: "Club Deportivo Morón",
	NCH: "Club Atlético Nueva Chicago",
	NOB: "Club Atlético Newell's Old Boys",
	PLA: "Club Atlético Platense",
	QUI: "Quilmes Atlético Club",
	RAC: "Racing Club",
	RAF: "Asociación Mutual Social y Deportiva Atlético de Rafaela",
	RIE: "Club Deportivo Riestra",
	RIV: "Club Atlético River Plate",
	ROS: "Club Atlético Rosario Central",
	RPI: "Real Pilar Fútbol Club",
	SAC: "Sacachispas Fútbol Club",
	SAR: "Club Atlético Sarmiento (Junín)",
	SDM: "Club Social y Deportivo Sol de Mayo",
	SLO: "Club Atlético San Lorenzo de Almagro",
	SMG: "Club Atlético San Miguel",
	SMJ: "Club Atlético San Martín (San Juan)",
	SMT: "Club Atlético San Martín (Tucumán)",
	STE: "Club Atlético San Telmo",
	TAL: "Club Atlético Talleres (Córdoba)",
	TIG: "Club Atlético Tigre",
	TRE: "Club Atlético Talleres (Remedios de Escalada)",
	UNI: "Club Atlético Unión",
	VEL: "Club Atlético Vélez Sarsfield",
};

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
		reemplazados.set(matches[0].pid, { nombre, nacimiento });
		borrados.push(`${nombre} (pid ${matches[0].pid})`);
	}

	// 3. Jugadores nuevos
	// Los prospectos generados no tienen pid (lo asigna el juego al importar)
	let pid =
		Math.max(
			...league.players
				.map((p: any) => p.pid)
				.filter((x: unknown) => typeof x === "number"),
		) + 1;
	const nuevos = [];
	for (const j of plantel.jugadores) {
		const nac = parseFecha(j.nac);
		const edad = SEASON - nac.y;
		const pos = posicion(j.pos, j.pie);
		const ovrMeta = j.ovr ?? ovrSugerido(j, edad);
		if (!j.altura) {
			throw new Error(`${j.nombre} ${j.apellido}: falta la altura`);
		}
		// Ratings exactos (los que el usuario ajustó a mano en el juego) o
		// generados con la norma de la posición
		const r = j.ratings
			? { ...j.ratings, hgt: Math.round(((j.altura * 100 - 156) * 100) / 44) }
			: generarRatings(j, pos, edad, ovrMeta);
		if (j.ratings && ovrOficial(r) !== ovrMeta) {
			throw new Error(
				`${j.nombre} ${j.apellido}: sus ratings dan OVR ${ovrOficial(r)}, no ${ovrMeta}`,
			);
		}
		// Contrato sin fecha en Transfermarkt ("-"): hasta 2027
		const exp = j.contrato ? parseFecha(j.contrato).y : SEASON + 1;
		const amount = sueldo(j.valor, ovrMeta);
		const cm = j.altura * 100;

		const clubDebut = j.debut?.club
			? league.teams.find((t: any) => t.abbrev === j.debut.club)
			: undefined;
		if (j.debut?.club && !clubDebut) {
			throw new Error(`${j.nombre} ${j.apellido}: no existe ${j.debut.club}`);
		}

		// En BBGM, el draft de un año se juega al final de esa temporada: los que
		// debutan en la temporada actual vienen del draft del año anterior (y así
		// también pueden ganar la Revelación del Año)
		const anioDraft =
			j.debut?.anio === SEASON ? SEASON - 1 : (j.debut?.anio ?? nac.y + 18);

		const p: any = {
			pid,
			tid: j.prospecto ? -2 : team.tid,
			firstName: j.nombre,
			lastName: j.apellido,
			pos,
			// Pulgadas con decimales: así la altura en pantalla es la real
			hgt: Math.round((cm / 2.54) * 100) / 100,
			weight: Math.round(23.5 * j.altura ** 2 * 2.2046),
			born: { year: nac.y, loc: j.pais },
			college:
				j.college ??
				(clubDebut && !j.prospecto
					? (NOMBRE_COMPLETO[clubDebut.abbrev] ??
						(() => {
							throw new Error(
								`Falta el nombre completo de ${clubDebut.abbrev}`,
							);
						})())
					: ""),
			draft: j.prospecto
				? { round: 0, pick: 0, tid: -1, originalTid: -1, year: SEASON }
				: {
						round: 0,
						pick: 0,
						tid: clubDebut?.tid ?? -1,
						originalTid: clubDebut?.tid ?? -1,
						year: anioDraft,
					},
			imgURL: j.imgURL ?? "",
			// Los prospectos no tienen contrato: lo firman al ser elegidos
			contracts: j.prospecto
				? []
				: [
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
			// Lesión actual: partidos que le faltan (1 partido ≈ 1 semana)
			injury: j.lesion
				? { type: j.lesion.tipo, gamesRemaining: j.lesion.partidos }
				: { type: "Healthy", gamesRemaining: 0 },
			relatives: [],
			gamesUntilTradable: 0,
			numDaysFreeAgent: 0,
			ptModifier: 1,
			yearsFreeAgent: 0,
		};
		if (j.n && !j.prospecto) {
			p.jerseyNumber = j.n;
		}
		nuevos.push({
			p,
			j,
			edad,
			amount: j.prospecto ? 0 : amount,
			exp,
			clubDebut: j.prospecto ? undefined : clubDebut,
		});
		pid += 1;
	}
	// Rasgos de personalidad (F fama, L lealtad, $ plata, W ganar). Leal: el
	// que debutó en 2021 o antes y juega en el club que lo drafteó o en el de su
	// College, o el que el usuario indique ("leal": true, ej.: ídolos que
	// llegaron de afuera). El resto, sorteado como en el juego (uno, y la mitad
	// de las veces un segundo), pero sin lealtad
	for (const { p, j } of nuevos) {
		if (j.prospecto) {
			continue;
		}
		const leal =
			j.leal === true ||
			((j.debut?.anio ?? Infinity) <= ULTIMO_ANIO_LEALTAD &&
				(p.draft.tid === team.tid ||
					p.college === NOMBRE_COMPLETO[team.abbrev]));
		const rand = azar(`rasgos ${j.nombre} ${j.apellido} ${j.nac}`);
		const otros = ["F", "$", "W"];
		const elegir = (xs: string[]) => xs[Math.floor(rand() * xs.length)]!;
		const rasgos = leal ? ["L"] : [elegir(otros)];
		if (rand() < 0.5) {
			rasgos.push(elegir(otros.filter((x) => !rasgos.includes(x))));
		}
		p.moodTraits = rasgos.sort();
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
		const draft = j.prospecto
			? `PROSPECTO draft ${p.draft.year}`
			: clubDebut
				? `draft ${p.draft.year} R${p.draft.round} P${p.draft.pick} ${clubDebut.abbrev}${clubDebut.disabled ? " (inactivo)" : ""}`
				: `sin draft (${p.draft.year})`;
		filas.push(
			[
				(p.jerseyNumber ?? "-").padStart(2),
				`${p.firstName} ${p.lastName}`.padEnd(20),
				p.pos.padEnd(2),
				String(edad).padStart(2),
				`OVR ${r.ovr}${j.ovr ? "*" : " "}`,
				j.prospecto
					? "sin contrato"
					: `$${(amount / 1000).toFixed(2)}M hasta ${exp}`,
				draft,
				`college: ${p.college || "-"}`,
				j.lesion
					? `lesión: ${j.lesion.tipo} (${j.lesion.partidos} partidos)`
					: "",
			].join(" | "),
		);
	}
	console.log(filas.join("\n"));
	const enPlantel = nuevos.filter(({ j }) => !j.prospecto).length;
	console.log(
		`${enPlantel} jugadores en el plantel, planilla $${(payroll / 1000).toFixed(1)}M (tope $${ga.salaryCap / 1000}M)`,
	);
};

// Expectativa de la hinchada (hype) y estrategia de la IA según la tabla anual
// 2026 (puntos en 32 fechas). El hype va de 0,10 (último) a 0,90 (primero) y
// mueve la asistencia, los ingresos y el humor de los jugadores; los 15
// primeros arrancan compitiendo y el resto reconstruyendo. Después el juego
// los actualiza solo, temporada a temporada.
const TABLA_ANUAL_2026: Record<string, number> = {
	BOC: 63,
	ROS: 62,
	ARG: 60,
	IRM: 57,
	GIM: 57,
	VEL: 56,
	RIV: 55,
	INS: 55,
	LAN: 50,
	BEL: 49,
	EST: 47,
	BAR: 47,
	DYJ: 47,
	IND: 47,
	HUR: 44,
	UNI: 42,
	GEM: 41,
	SLO: 41,
	SAR: 40,
	TIG: 39,
	TAL: 39,
	NOB: 38,
	RAC: 36,
	PLA: 36,
	BAN: 33,
	ATU: 32,
	CCO: 27,
	RIE: 23,
	ALD: 19,
	ERC: 14,
};
{
	const puntos = Object.values(TABLA_ANUAL_2026);
	const max = Math.max(...puntos);
	const min = Math.min(...puntos);
	const orden = Object.entries(TABLA_ANUAL_2026).sort((a, b) => b[1] - a[1]);
	for (const t of league.teams.filter((t2: any) => !t2.disabled)) {
		const pts = TABLA_ANUAL_2026[t.abbrev];
		if (pts === undefined) {
			throw new Error(`${t.abbrev} no está en la tabla anual`);
		}
		const fila = t.seasons.find((s: any) => s.season === SEASON);
		fila.hype =
			Math.round((0.1 + (0.8 * (pts - min)) / (max - min)) * 100) / 100;
		const puesto = orden.findIndex(([ab]) => ab === t.abbrev) + 1;
		t.strategy = puesto <= 15 ? "contending" : "rebuilding";
	}
}

for (const file of plantelFiles) {
	cargar(JSON.parse(readFileSync(file, "utf8")));
}

// Parientes de jugadores reemplazados: pasan al jugador nuevo, en los dos
// sentidos; y se borran los que apuntan a jugadores que no existen
{
	const VUELTA0: Record<string, string> = {
		brother: "brother",
		son: "father",
		father: "son",
	};
	const porPid = new Map(league.players.map((p: any) => [p.pid, p]));
	for (const p of league.players) {
		const nuevos: any[] = [];
		for (const r of p.relatives ?? []) {
			const viejo = reemplazados.get(r.pid);
			if (viejo) {
				const nuevo = league.players.find(
					(q: any) =>
						q.tid !== -3 &&
						norm(`${q.firstName} ${q.lastName}`) === norm(viejo.nombre) &&
						Math.abs(q.born.year - viejo.nacimiento) <= 1,
				);
				if (nuevo) {
					nuevos.push({ ...r, pid: nuevo.pid });
					nuevo.relatives = (nuevo.relatives ?? []).filter(
						(x: any) => x.pid !== p.pid,
					);
					nuevo.relatives.push({
						type: VUELTA0[r.type] ?? r.type,
						pid: p.pid,
						name: `${p.firstName} ${p.lastName}`,
					});
					console.log(
						`Parientes: ${p.firstName} ${p.lastName} -> ${nuevo.firstName} ${nuevo.lastName} (nuevo)`,
					);
					continue;
				}
			}
			if (porPid.has(r.pid)) {
				nuevos.push(r);
			} else {
				console.log(
					`Pariente borrado (no existe): ${p.firstName} ${p.lastName} -> ${r.name}`,
				);
			}
		}
		if (p.relatives) {
			p.relatives = nuevos;
		}
	}
}

// Parientes ("parientes": [{ "tipo": "brother", "nombre": "..." }]), en los dos
// sentidos. Se resuelven al final, cuando ya están todos los planteles
{
	const VUELTA: Record<string, string> = {
		brother: "brother",
		son: "father",
		father: "son",
	};
	const buscar = (nombre: string) =>
		league.players.filter(
			(p: any) =>
				p.tid !== -3 && norm(`${p.firstName} ${p.lastName}`) === norm(nombre),
		);
	for (const file of plantelFiles) {
		const plantel = JSON.parse(readFileSync(file, "utf8"));
		for (const j of plantel.jugadores) {
			for (const { tipo, nombre } of j.parientes ?? []) {
				const [p] = buscar(`${j.nombre} ${j.apellido}`);
				const otros = buscar(nombre);
				if (!p || otros.length !== 1) {
					console.log(
						`Pariente sin resolver: ${j.nombre} ${j.apellido} -> ${nombre} (${otros.length})`,
					);
					continue;
				}
				const otro = otros[0];
				const agregar = (a: any, b: any, type: string) => {
					a.relatives = (a.relatives ?? []).filter((r: any) => r.pid !== b.pid);
					a.relatives.push({
						type,
						pid: b.pid,
						name: `${b.firstName} ${b.lastName}`,
					});
				};
				agregar(p, otro, tipo);
				agregar(otro, p, VUELTA[tipo] ?? tipo);
				console.log(
					`Parientes: ${p.firstName} ${p.lastName} (${tipo}) ${otro.firstName} ${otro.lastName}`,
				);
			}
		}
	}
}
console.log(
	"\n* OVR indicado en el plantel; el resto, sugerido por la fórmula",
);

const planillas = league.teams
	.filter((t: any) => !t.disabled)
	.map((t: any) => {
		const ps = league.players.filter((p: any) => p.tid === t.tid);
		const total = ps.reduce(
			(sum: number, p: any) => sum + (p.contracts.at(-1)?.amounts[0] ?? 0),
			0,
		);
		return { abbrev: t.abbrev, n: ps.length, total };
	})
	.sort((a: any, b: any) => b.total - a.total);
console.log(
	`\nPlanillas (tope $${ga.salaryCap / 1000}M, lujo $${ga.luxuryPayroll / 1000}M, mínimo $${ga.minPayroll / 1000}M):`,
);
console.log(
	planillas
		.map((x: any) => `${x.abbrev} $${(x.total / 1000).toFixed(1)}M (${x.n})`)
		.join(" | "),
);

// Sin eventos guardados: así el juego escribe la bienvenida ("Welcome to your
// new league!") con el escudo del equipo que elige el usuario al crear la liga.
// La v2.0 traía una sola, vieja, con el escudo de Unión
delete league.events;

writeFileSync(output, JSON.stringify(league));
