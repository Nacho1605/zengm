// Generación de jugadores nuevos para el modo fútbol (11 en cancha).
//
// En básquet, BBGM primero genera los ratings y después calcula la posición.
// Acá es al revés: primero se elige la posición, después la altura y los
// ratings según la norma de esa posición, y la posición queda fija.
//
// Recordatorio de cómo usa cada rating el motor (ver COMPOSITE_WEIGHTS):
//   taponar  = hgt 2.5, jmp 1.5, diq 0.5   -> atajadas / cortes
//   rebotar  = hgt 2, reb 2, oiq/diq 0.5   -> controlar la segunda pelota
//   uso      = ins 1.5, dnk/fg/tp 1, ...   -> quién define las jugadas
//   pase     = pss 1, oiq 0.5, drb 0.4
//   manejo   = drb 1, spd 1
//   defensa  = diq 2, hgt/stre/spd 1, jmp 0.5
//   robo     = diq 2, spd 1

import genFuzz from "./genFuzz.ts";
import heightToRating from "./heightToRating.ts";
import limitRating from "./limitRating.ts";
import { g, helpers } from "../../util/index.ts";
import type {
	PlayerRatings,
	RatingKey,
} from "../../../common/types.basketball.ts";
import { randInt, realGauss } from "../../../common/random.ts";

type PositionProfile = {
	// Peso relativo de la posición entre los jugadores nuevos
	frequency: number;

	// Altura real en centímetros: media y desvío
	heightCm: [number, number];

	// Multiplicadores sobre el valor base de cada rating. 1 = normal.
	factors: Partial<Record<Exclude<RatingKey, "hgt">, number>>;
};

// Ataque prácticamente nulo
const NO_OFFENSE = 0.1;

export const FUTBOL_POSITION_PROFILES: Record<string, PositionProfile> = {
	// Arquero: taponador y reboteador, sin función ofensiva
	C: {
		frequency: 8,
		heightCm: [190, 4],
		factors: {
			jmp: 1.5,
			diq: 1.5,
			reb: 1.7,
			stre: 1.1,
			spd: 0.8,
			ins: NO_OFFENSE,
			dnk: NO_OFFENSE,
			fg: NO_OFFENSE,
			tp: NO_OFFENSE,
			// Not for attacking: the sim uses them so the team doesn't lose the ball
			oiq: 0.5,
			drb: 0.5,
			pss: 0.6,
			ft: 0.6,
		},
	},

	// Lateral: velocidad, resistencia y marca
	GF: {
		frequency: 14,
		heightCm: [177, 5],
		factors: {
			spd: 1.4,
			endu: 1.4,
			diq: 1.2,
			stre: 1.0,
			drb: 1.0,
			pss: 1.0,
			tp: 0.8,
			ins: 0.6,
			dnk: 0.6,
			fg: 0.8,
		},
	},

	// Defensor central (#6): más defensivo que ofensivo, con salida limpia
	PF: {
		frequency: 9,
		heightCm: [186, 4],
		factors: {
			diq: 1.5,
			stre: 1.2,
			jmp: 1.2,
			reb: 1.3,
			pss: 1.0,
			spd: 0.9,
			drb: 0.6,
			oiq: 0.7,
			ins: 0.6,
			dnk: 0.6,
			fg: 0.5,
			tp: 0.4,
		},
	},

	// Defensor central (#2): más defensivo que ofensivo, el más físico
	FC: {
		frequency: 9,
		heightCm: [187, 4],
		factors: {
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
	},

	// Mediocampista defensivo: marca, despliegue y pase
	G: {
		frequency: 10,
		heightCm: [180, 5],
		factors: {
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
	},

	// Volante mixto: equilibrado, mucho despliegue
	SG: {
		frequency: 12,
		heightCm: [178, 5],
		factors: {
			endu: 1.4,
			pss: 1.2,
			drb: 1.1,
			diq: 1.1,
			oiq: 1.1,
			fg: 1.0,
			tp: 1.0,
		},
	},

	// Mediapunta: buen pase y creatividad
	PG: {
		frequency: 10,
		heightCm: [175, 5],
		factors: {
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
	},

	// Extremo: buena velocidad y gambeta
	SF: {
		frequency: 14,
		heightCm: [174, 5],
		factors: {
			spd: 1.65,
			drb: 1.5,
			jmp: 1.2,
			tp: 1.1,
			fg: 1.0,
			pss: 1.0,
			diq: 0.7,
			stre: 0.8,
			reb: 0.7,
		},
	},

	// Delantero centro: definición, potencia y juego aéreo
	F: {
		frequency: 14,
		heightCm: [183, 5],
		factors: {
			ins: 1.6,
			dnk: 1.5,
			fg: 1.3,
			stre: 1.2,
			oiq: 1.2,
			jmp: 1.2,
			tp: 0.9,
			pss: 0.8,
			drb: 0.9,
			diq: 0.5,
		},
	},
};

// Talent level. The factors above describe the *shape* of each position. They
// are then scaled so that their average is the same for every position and
// similar to basketball's (point/wing/big average between 1.09 and 1.29).
// That way a position profile changes what a player is good at, not how good
// he is overall. NO_OFFENSE factors are not scaled.
const TARGET_MEAN_FACTOR = 1.15;

// Per position value of the mean factor, used instead of TARGET_MEAN_FACTOR.
// Calibrated so that every position has a similar average ovr (about 33 for draft prospects, like in
// basketball). Without it, the basketball ovr formula (which weights diq and
// hgt heavily) would make defenders look better than attackers.
export const TALENT_BY_POSITION: Record<string, number> = {
	C: 0.78,
	GF: 1.08,
	PF: 1.03,
	FC: 1.05,
	G: 1.08,
	SG: 1.18,
	PG: 1.21,
	SF: 1.14,
	F: 1.26,
};
const NON_HEIGHT_RATINGS = [
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
] as const;

// Computed on each call, so that a tool can change TALENT_BY_POSITION (for
// example, to calibrate against a different ovr formula)
const getScaledFactors = (pos: string) => {
	const profile = FUTBOL_POSITION_PROFILES[pos]!;
	let fixedSum = 0;
	let scalableSum = 0;
	for (const key of NON_HEIGHT_RATINGS) {
		const factor = profile.factors[key] ?? 1;
		if (factor === NO_OFFENSE) {
			fixedSum += factor;
		} else {
			scalableSum += factor;
		}
	}
	const target = TALENT_BY_POSITION[pos] ?? TARGET_MEAN_FACTOR;
	const scale = (target * NON_HEIGHT_RATINGS.length - fixedSum) / scalableSum;
	const factors = {} as Record<(typeof NON_HEIGHT_RATINGS)[number], number>;
	for (const key of NON_HEIGHT_RATINGS) {
		const factor = profile.factors[key] ?? 1;
		factors[key] = factor === NO_OFFENSE ? factor : factor * scale;
	}
	return factors;
};

const pickPosition = () => {
	const entries = Object.entries(FUTBOL_POSITION_PROFILES);
	let total = 0;
	for (const [, profile] of entries) {
		total += profile.frequency;
	}
	let rand = Math.random() * total;
	for (const [pos, profile] of entries) {
		rand -= profile.frequency;
		if (rand <= 0) {
			return pos;
		}
	}
	return entries.at(-1)![0];
};

const athleticismRatings = new Set(["stre", "spd", "jmp", "endu", "dnk"]);
const shootingRatings = new Set(["ft", "fg", "tp"]);
const skillRatings = new Set(["oiq", "diq", "drb", "pss", "reb"]); // ins purposely left out

const genRatingsFutbol = (
	season: number,
	scoutingLevel: number,
	posOverride?: string,
): {
	heightInInches: number;
	ratings: PlayerRatings;
	fixedPos: string;
} => {
	const pos =
		posOverride && FUTBOL_POSITION_PROFILES[posOverride]
			? posOverride
			: pickPosition();
	const profile = FUTBOL_POSITION_PROFILES[pos]!;
	const scaledFactors = getScaledFactors(pos);

	// The displayed height is heightInInches * heightFactor, so divide by it to
	// get a displayed height that matches real footballers
	const heightFactor = g.get("heightFactor") || 1;
	const heightCm = realGauss(profile.heightCm[0], profile.heightCm[1]);
	let heightInInches = heightCm / 2.54 / heightFactor;
	const wingspanAdjust = heightInInches + randInt(-1, 1);
	const hgt = heightToRating(wingspanAdjust);
	heightInInches = Math.round(heightInInches);

	// Same base values and talent correlations as basketball
	const rawRatings = {
		stre: 37,
		spd: 40,
		jmp: 40,
		endu: 17,
		ins: 27,
		dnk: 27,
		ft: 32,
		fg: 32,
		tp: 32,
		oiq: 22,
		diq: 22,
		drb: 37,
		pss: 37,
		reb: 37,
	};

	const factorAthleticism = helpers.bound(realGauss(1, 0.2), 0.2, 1.2);
	const factorShooting = helpers.bound(realGauss(1, 0.2), 0.2, 1.2);
	const factorSkill = helpers.bound(realGauss(1, 0.2), 0.2, 1.2);
	const factorIns = helpers.bound(realGauss(1, 0.2), 0.2, 1.2);

	for (const key of helpers.keys(rawRatings)) {
		const positionFactor = scaledFactors[key];
		let factor = factorIns;

		if (athleticismRatings.has(key)) {
			factor = factorAthleticism;
		} else if (shootingRatings.has(key)) {
			factor = factorShooting;
		} else if (skillRatings.has(key)) {
			factor = factorSkill;
		}

		rawRatings[key] = limitRating(
			factor * positionFactor * realGauss(rawRatings[key], 3),
		);
	}

	const ratings = {
		...rawRatings,
		hgt,
		fuzz: genFuzz(scoutingLevel),
		ovr: 0,
		pos,
		pot: 0,
		season,
		skills: [],
	};

	return {
		heightInInches,
		ratings,
		fixedPos: pos,
	};
};

export default genRatingsFutbol;
