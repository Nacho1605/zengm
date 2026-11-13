// Reglas de fútbol para la variante "BBGM Argentina".
//
// El motor sigue siendo el de básquet, pero cuando una liga juega con 11 en
// cancha se activa el "modo fútbol": formación obligatoria, cambios limitados y
// cansancio calibrado para 90 minutos.
//
// Las etiquetas de posición son las de BBGM, con significado de fútbol:
//   C  = Arquero
//   GF = Lateral, PF = Defensor central (#6), FC = Defensor central (#2)
//   PG = Mediapunta, SG = Volante mixto, G = Mediocampista defensivo
//   SF = Extremo (comodín: cuenta como mediocampista o como delantero)
//   F  = Delantero centro

export const FUTBOL_NUM_PLAYERS_ON_COURT = 11;

// Cambios por partido y por equipo. El jugador que sale no puede volver.
export const FUTBOL_MAX_SUBS = 5;

// Goles. El motor de básquet genera muchas más posesiones y tiros que un
// partido de fútbol, así que en modo fútbol se ajustan los valores de abajo.
// Están calibrados con los planteles reales del archivo Argentina 2023: unos
// 1,2 goles, 11 remates y 3,6 atajadas por equipo, y 28% de empates.
// - Antes de cada ataque la pelota circula en el medio. Ese tiempo (en segundos
//   de juego) no genera estadísticas, y hace que haya menos ataques.
export const FUTBOL_BUILD_UP_SECONDS: [number, number] = [110, 230];
// - Solo una parte de los tiros termina en gol.
export const FUTBOL_FINISHING_FACTOR = 0.38;
// - Una falta en un remate es un penal, mucho menos común que una falta de tiro
//   en básquet.
export const FUTBOL_PENALTY_FOUL_FACTOR = 0.09;

// Atajadas. Muchos más remates terminan bloqueados que en básquet, y la mayoría
// los ataja el arquero.
export const FUTBOL_SAVE_FACTOR = 8;
export const FUTBOL_KEEPER_SAVE_SHARE = 0.6;

export const isFutbolMode = (numPlayersOnCourt: number) =>
	numPlayersOnCourt >= FUTBOL_NUM_PLAYERS_ON_COURT;

export type FutbolLine =
	| "arquero"
	| "defensor"
	| "mediocampista"
	| "delantero"
	| "comodin";

export const FUTBOL_LINES: FutbolLine[] = [
	"arquero",
	"defensor",
	"mediocampista",
	"delantero",
	"comodin",
];

export const futbolLine = (pos: string): FutbolLine => {
	switch (pos) {
		case "C":
			return "arquero";
		case "GF":
		case "PF":
		case "FC":
			return "defensor";
		case "PG":
		case "SG":
		case "G":
			return "mediocampista";
		case "F":
			return "delantero";
		default:
			// SF, y cualquier etiqueta desconocida, es comodín
			return "comodin";
	}
};

// Mínimo y máximo de jugadores por línea en cancha. El comodín (SF) no tiene
// límite propio: se reparte entre mediocampo y delantera.
export const FUTBOL_LIMITS = {
	arquero: [1, 1],
	defensor: [3, 5],
	mediocampista: [3, 5],
	delantero: [1, 4],
} as const;

export type FutbolLineCounts = Record<FutbolLine, number>;

export const emptyLineCounts = (): FutbolLineCounts => ({
	arquero: 0,
	defensor: 0,
	mediocampista: 0,
	delantero: 0,
	comodin: 0,
});

export const countLines = (positions: string[]): FutbolLineCounts => {
	const counts = emptyLineCounts();
	for (const pos of positions) {
		counts[futbolLine(pos)] += 1;
	}
	return counts;
};

const distanceToRange = (
	value: number,
	[min, max]: readonly [number, number],
) => (value < min ? min - value : value > max ? value - max : 0);

/**
 * Cuántas "infracciones" tiene una formación. 0 significa válida.
 *
 * numPlayers es 11, o menos si hay expulsados.
 *
 * Los comodines (SF) se reparten entre mediocampo y delantera de la forma que
 * menos infracciones produzca.
 */
export const lineupViolations = (
	counts: FutbolLineCounts,
	numPlayers: number = FUTBOL_NUM_PLAYERS_ON_COURT,
): number => {
	const total =
		counts.arquero +
		counts.defensor +
		counts.mediocampista +
		counts.delantero +
		counts.comodin;

	let base =
		Math.abs(total - numPlayers) +
		distanceToRange(counts.arquero, FUTBOL_LIMITS.arquero) +
		distanceToRange(counts.defensor, FUTBOL_LIMITS.defensor);

	let bestSplit = Infinity;
	for (let toMid = 0; toMid <= counts.comodin; toMid++) {
		const toFwd = counts.comodin - toMid;
		const value =
			distanceToRange(
				counts.mediocampista + toMid,
				FUTBOL_LIMITS.mediocampista,
			) + distanceToRange(counts.delantero + toFwd, FUTBOL_LIMITS.delantero);
		if (value < bestSplit) {
			bestSplit = value;
		}
	}

	base += bestSplit;

	return base;
};

export const isValidFutbolLineup = (positions: string[]) =>
	lineupViolations(countLines(positions)) === 0;

/**
 * ¿Se puede completar una formación válida agregando exactamente `slotsLeft`
 * jugadores, sin usar más de los disponibles en cada línea?
 */
export const canCompleteLineup = (
	counts: FutbolLineCounts,
	slotsLeft: number,
	available: FutbolLineCounts,
): boolean => {
	const maxA = Math.min(available.arquero, slotsLeft);
	for (let a = 0; a <= maxA; a++) {
		const maxD = Math.min(available.defensor, slotsLeft - a);
		for (let d = 0; d <= maxD; d++) {
			const maxM = Math.min(available.mediocampista, slotsLeft - a - d);
			for (let m = 0; m <= maxM; m++) {
				const maxF = Math.min(available.delantero, slotsLeft - a - d - m);
				for (let f = 0; f <= maxF; f++) {
					const s = slotsLeft - a - d - m - f;
					if (s > available.comodin) {
						continue;
					}
					const result = {
						arquero: counts.arquero + a,
						defensor: counts.defensor + d,
						mediocampista: counts.mediocampista + m,
						delantero: counts.delantero + f,
						comodin: counts.comodin + s,
					};
					if (lineupViolations(result) === 0) {
						return true;
					}
				}
			}
		}
	}
	return false;
};

/**
 * Elegir el once inicial.
 *
 * @param positions Posiciones del plantel, ya ordenado del mejor al peor.
 * @return Índices de los titulares (11, salvo que el plantel tenga menos
 * jugadores). Si el plantel no permite una formación válida (por ejemplo, no
 * tiene arquero), se completa con los mejores disponibles.
 */
export const findStartersFutbol = (positions: string[]): number[] => {
	const numStarters = Math.min(FUTBOL_NUM_PLAYERS_ON_COURT, positions.length);
	const starters: number[] = [];
	const counts = emptyLineCounts();
	const lines = positions.map(futbolLine);

	const availableExcluding = (exclude: number) => {
		const available = emptyLineCounts();
		for (const [i, line] of lines.entries()) {
			if (i !== exclude && !starters.includes(i)) {
				available[line] += 1;
			}
		}
		return available;
	};

	// Recorrer el plantel en orden de calidad. Un jugador entra si, con él, la
	// formación todavía se puede completar con el resto del plantel. Se repite
	// por si un jugador salteado se vuelve necesario más tarde.
	let progress = true;
	while (starters.length < numStarters && progress) {
		progress = false;
		for (const [i, line] of lines.entries()) {
			if (starters.length >= numStarters) {
				break;
			}
			if (starters.includes(i)) {
				continue;
			}
			const newCounts = { ...counts, [line]: counts[line] + 1 };
			if (
				canCompleteLineup(
					newCounts,
					numStarters - starters.length - 1,
					availableExcluding(i),
				)
			) {
				starters.push(i);
				counts[line] += 1;
				progress = true;
			}
		}
	}

	// Si no hay formación válida posible, completar con los mejores, evitando un
	// segundo arquero mientras se pueda
	for (const avoidSecondGk of [true, false]) {
		for (const [i, line] of lines.entries()) {
			if (starters.length >= numStarters) {
				break;
			}
			if (starters.includes(i)) {
				continue;
			}
			if (avoidSecondGk && line === "arquero" && counts.arquero >= 1) {
				continue;
			}
			starters.push(i);
			counts[line] += 1;
		}
	}

	return starters;
};
