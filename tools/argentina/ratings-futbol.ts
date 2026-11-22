// Ratings de fútbol para los jugadores reales: OVR oficial del juego, posición
// fija según Transfermarkt, norma de cada posición y generador de ratings que
// llega exactamente al OVR buscado. Lo usan cargar-plantel.ts y las
// herramientas que cambian ratings.

export type Key =
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
export const KEYS: Key[] = [
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
export type Ratings = Record<Key, number>;

// OVR oficial de BBGM (src/worker/core/player/ovr.basketball.ts)
export const ovrOficial = (r: Ratings) => {
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
export const posicion = (tm: string, pie: string | null) => {
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
export const NORMA: Record<string, Partial<Record<Key, number>>> = {
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
export const ESCALA_NORMA = 30;

// Los arqueros no rematan: tiro en 0
export const SIN_TIRO: Key[] = ["ins", "dnk", "fg", "tp"];

// Generador al azar con semilla (el mismo jugador da siempre los mismos ratings)
export const azar = (semilla: string) => {
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

export const MINUTOS_TEMPORADA = 3330; // 37 partidos completos

export const hgtRating = (cm: number) =>
	Math.max(0, Math.min(100, Math.round(((cm - 156) * 100) / 44)));

// Forma de los ratings (no cambia el OVR, que siempre da exacto: cambia cómo se
// reparte). La forma 1 es la original; la 2 (desde la v2.15.4) marca más la
// diferencia entre atacar y defender según la posición, reparte la
// experiencia según la línea, relaciona la fuerza con la altura y suma los
// rasgos de juego que indica el usuario.
export type Forma = {
	// Puntos que se suman o restan a la norma de cada posición
	contraste: Record<string, Partial<Record<Key, number>>>;
	// Experiencia: qué parte va a la inteligencia ofensiva y a la defensiva,
	// según la línea (atacantes, defensores y el resto)
	experiencia: Record<"ataque" | "defensa" | "medio", { oiq: number; diq: number }>;
	// Puntos de fuerza por cada cm por encima (o por debajo) de 1,80 m
	fuerzaPorCm: number;
	// Rasgos de juego del plantel ("rasgos": ["gambeta", ...]); "aereo" está
	// en las dos formas
	rasgos: Record<string, Partial<Record<Key, number>>>;
	// Techo suave: por encima de "desde", cada punto cuenta "factor"; nunca
	// pasa de "max" (ningún rating llega a 100)
	techo?: { desde: number; factor: number; max: number };
	// Gol: atacantes con más de 0,2 goles cada 90' suman "escala" puntos de
	// ins y dnk por cada gol de más (y la mitad en fg), entre "min" y "max".
	// Sin este campo: escala 25, entre -6 y +8 (formas 1 y 2)
	gol?: { escala: number; min: number; max: number };
};

export const FORMA_1: Forma = {
	contraste: {},
	experiencia: {
		ataque: { oiq: 1, diq: 1 },
		defensa: { oiq: 1, diq: 1 },
		medio: { oiq: 1, diq: 1 },
	},
	fuerzaPorCm: 0,
	rasgos: {},
};

export const FORMA_2: Forma = {
	contraste: {
		// Atacantes: defienden y van a la segunda pelota menos que hoy
		F: { diq: -12, reb: -12 },
		SF: { diq: -10, reb: -8 },
		PG: { diq: -8, reb: -6 },
		// Defensores: rematan, gambetean y crean menos que hoy
		FC: { ins: -12, dnk: -10, fg: -8, tp: -6, oiq: -4, drb: -6 },
		PF: { ins: -12, dnk: -10, fg: -8, tp: -6, oiq: -3, drb: -5 },
		GF: { ins: -6, dnk: -6, fg: -4, tp: -2 },
		G: { ins: -6, dnk: -6, fg: -2 },
	},
	experiencia: {
		ataque: { oiq: 1, diq: 0.5 },
		defensa: { oiq: 0.5, diq: 1 },
		medio: { oiq: 1, diq: 1 },
	},
	fuerzaPorCm: 0.6,
	// Ningún rating llega a 100: desde 93, cada punto cuenta la mitad; tope 95
	techo: { desde: 93, factor: 0.5, max: 95 },
	rasgos: {
		// Arquetipos que indica el usuario. Con "+" (ej.: "gambeta+") el efecto
		// es una vez y media el normal: el que se destaca aun entre los de su tipo
		goleador: { ins: 10, dnk: 6 },
		pegador: { tp: 10, fg: 6 },
		// Remate y envíos de larga distancia (v2.20; Soñora, Alanís)
		"larga distancia": { tp: 10, pss: 4 },
		aereo: { jmp: 8, dnk: 5, reb: 4 },
		gambeta: { drb: 12, spd: 2 },
		veloz: { spd: 12, endu: 2 },
		"pelota parada": { ft: 12, tp: 4 },
		habilidoso: { drb: 8, oiq: 4, pss: 3 },
		pase: { pss: 12, oiq: 4 },
		cerebro: { oiq: 8, pss: 6 },
		centrador: { pss: 8, tp: 4, endu: 3 },
		recuperador: { diq: 8, stre: 3, reb: 2 },
		potente: { stre: 10, jmp: 3 },
		pulmon: { endu: 12, diq: 2 },
		tactico: { oiq: 5, diq: 5 },
		// Arqueros
		reflejos: { jmp: 8, diq: 3 },
		achique: { reb: 8, stre: 3 },
		pies: { pss: 10, oiq: 3 },
		// Defectos
		lento: { spd: -12 },
	},
};

// Forma 3 (desde la v2.17.2, pedido del usuario): los delanteros tenían ins y
// dnk inflados (95 los goleadores, 77 de promedio). Como esos dos ratings casi
// no pesan en el OVR, el generador los subía casi gratis: norma alta del
// delantero, bonificación por goles, rasgo goleador y, en los altos o
// veteranos, un nivel base más alto. La forma 3 baja la norma del delantero
// en ins y dnk, mantiene la diferencia por goles (algo más pareja) y suaviza
// el rasgo goleador. El OVR no cambia: lo que se saca de ins y dnk vuelve
// repartido en el resto.
export const FORMA_3: Forma = {
	...FORMA_2,
	contraste: {
		...FORMA_2.contraste,
		F: { ...FORMA_2.contraste.F, ins: -15, dnk: -14 },
	},
	gol: { escala: 20, min: -6, max: 8 },
	rasgos: { ...FORMA_2.rasgos, goleador: { ins: 6, dnk: 3 } },
};

// Forma con la que se arma el archivo. FORMA=2 en el entorno arma con la
// forma anterior (para comprobar que el resto del archivo no cambia)
export const FORMA_VIGENTE: Forma = process.env.FORMA === "2" ? FORMA_2 : FORMA_3;

const LINEA: Record<string, "ataque" | "defensa" | "medio"> = {
	F: "ataque",
	SF: "ataque",
	PG: "ataque",
	C: "defensa",
	FC: "defensa",
	PF: "defensa",
	GF: "defensa",
	G: "medio",
	SG: "medio",
};

export const generarRatings = (
	j: any,
	pos: string,
	edad: number,
	ovrMeta: number,
	forma: Forma = FORMA_2,
) => {
	const rand = azar(`${j.nombre} ${j.apellido} ${j.nac}`);
	const cm = Math.round(j.altura * 100);
	const norma = NORMA[pos]!;
	const contraste = forma.contraste[pos] ?? {};

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
	const reparto = forma.experiencia[LINEA[pos] ?? "medio"];
	sumar("oiq", experiencia * reparto.oiq);
	sumar("diq", experiencia * reparto.diq);
	if (forma.fuerzaPorCm !== 0) {
		sumar("stre", forma.fuerzaPorCm * (cm - 180));
	}
	sumar("endu", 10 * (Math.min(1, j.min / MINUTOS_TEMPORADA) - 0.5));
	if (j.min >= 300 && pos !== "C") {
		const golesPor90 = (j.goles * 90) / j.min;
		if (["F", "SF", "PG", "SG"].includes(pos)) {
			const g = forma.gol ?? { escala: 25, min: -6, max: 8 };
			const gol = Math.max(g.min, Math.min(g.max, (golesPor90 - 0.2) * g.escala));
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
	// Forma 1: solo "aereo", fijo
	if (!forma.rasgos.aereo && j.rasgos?.includes("aereo")) {
		// Gran cabeceador
		sumar("jmp", 8);
		sumar("dnk", 5);
		sumar("reb", 4);
	}
	for (const texto of j.rasgos ?? []) {
		const mas = texto.endsWith("+");
		const rasgo = mas ? texto.slice(0, -1) : texto;
		const efecto = forma.rasgos[rasgo];
		if (!efecto) {
			if (forma.rasgos.aereo) {
				throw new Error(`${j.nombre} ${j.apellido}: rasgo desconocido "${texto}"`);
			}
			continue;
		}
		for (const [k, v] of Object.entries(efecto)) {
			sumar(k as Key, v! * (mas ? 1.5 : 1));
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
			const v =
				base +
				ESCALA_NORMA * ((norma[k] ?? 1) - 1) +
				(contraste[k] ?? 0) +
				(ajuste[k] ?? 0);
			const t = forma.techo;
			const w = t && v > t.desde ? Math.min(t.max, t.desde + (v - t.desde) * t.factor) : v;
			r[k] = Math.max(0, Math.min(100, Math.round(w)));
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
