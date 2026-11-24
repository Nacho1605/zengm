// Siglas y nombres como los dejó el usuario en el juego (25/11, sobre la
// v2.24.5): "Golden Boot", "Golden Glove", "ROY", "TOTS-D/M/A", "All-Rookie",
// "Midfielder of the Year", "Finals MVP"; sacó Iron Man y Semifinal MVP.
// Premios de fin de temporada de la liga ("gala"; desde la v2.24.2, segunda
// versión en la v2.24.3 con lo que mostraron dos temporadas simuladas por el
// usuario). Nombres en inglés por ahora (pedido del usuario, 24/11). Ver
// data/argentina/premios.md.
//
// Bases (el motor juega básquet por dentro, ver activar-futbol.ts):
// - Nunca se usan las WS (ws, ows): con 11 en cancha, una cuenta del motor
//   (qAst, con un 5 fijo) las dispara en jugadores de pocos minutos que
//   convierten mucho (caso Barbieri, All-Star con 12 minutos).
// - Medidas en la escala de la liga: PER (15 = promedio), BPM ofensivo y
//   defensivo (0 = promedio) y % de victorias.
// - Participación: minutos jugados sobre un umbral, con tope 1 y elevada a una
//   potencia: el que jugó poco no gana aunque sus números por minuto sean
//   enormes. 2700' = 30 partidos completos de 43.
// - Cada puesto pesa distinto lo ofensivo y lo defensivo. En el motor, los
//   centrales y el arquero juntan rebotes y tapones (su BPM defensivo sube) y
//   los mediapuntas, asistencias: por eso los premios que mezclan puestos
//   llevan un factor por puesto (lo que mostraron las simulaciones: ningún
//   delantero en el equipo ideal de ataque, ningún lateral en el de defensa,
//   un arquero figura de semifinal).

// Peso de lo ofensivo y lo defensivo según el puesto (C arquero, FC/PF
// centrales, GF laterales, G pivote, SG volante, PG mediapunta, SF extremo,
// F delantero)
export const PESOS: Record<string, [number, number]> = {
	F: [0.85, 0.15],
	SF: [0.75, 0.25],
	PG: [0.7, 0.3],
	SG: [0.5, 0.5],
	G: [0.35, 0.65],
	GF: [0.35, 0.65],
	FC: [0.2, 0.8],
	PF: [0.2, 0.8],
	C: [0.1, 0.9],
};
// Peso del puesto en los premios de toda la liga (como en el fútbol: los
// grandes premios los ganan sobre todo los que atacan)
// v2.24.4, con la temporada simulada de la v2.24.3: en el motor los
// mediapuntas juntan muchos números (6 de los 10 primeros del Ballon d'Or) y
// un arquero quedó 7.º. v2.24.6, calibrado con la liga exportada del usuario
// (dos temporadas en la v2.24.5; las cuentas de calibrar.ts dan los mismos
// puestos que el juego): con nueve 1,2, mediapunta 0,88 y arquero 0,6, los 10
// primeros quedan mezclados (2026: 4 extremos, 3 mediapuntas, 2 nueves y un
// pivote; 2027: 5 mediapuntas, 3 extremos y 2 nueves) y los ganadores no cambian
export const PRESTIGIO: Record<string, number> = {
	F: 1.2,
	SF: 1,
	PG: 0.88,
	SG: 0.96,
	G: 0.92,
	GF: 0.88,
	FC: 0.85,
	PF: 0.85,
	C: 0.6,
};
const PUESTOS = Object.keys(PESOS);
const FUERA = "-1000 + 0*gp";

const participacion = (umbral: number, potencia: number) =>
	`min(1, gp*min/${umbral})^${potencia}`;
// Rendimiento según el puesto: ataque (PER y BPM ofensivo) y defensa (BPM
// defensivo), los dos con promedio cerca de 2
const nucleo = (pos: string) => {
	const [o, d] = PESOS[pos]!;
	return `(${o}*(per/15 + (obpm + 3)/3) + ${d}*2*(dbpm + 3)/3)`;
};
// Temporada: rendimiento × participación × éxito del equipo
const temporada = (pos: string, factor: number, umbral = 2700) =>
	`${factor} * ${participacion(umbral, 1.5)} * ${nucleo(pos)} * (0.8 + 0.4*winp) + 0.3*seasonFraction*winp`;
// Fórmula por puesto: factor de cada puesto (los que no están, afuera)
const porPuesto = (
	factores: Record<string, number>,
	f: (pos: string, factor: number) => string,
) => Object.fromEntries(PUESTOS.map((p) => [p, p in factores ? f(p, factores[p]!) : FUERA]));
const solo = (pos: string[], factor = 1) => Object.fromEntries(pos.map((p) => [p, factor]));

// Partido de playoffs: puntaje del partido, con lo que no entra en él
// (robos, tapones, asistencias), casi el doble si ganó y 45' para sumar
// completo. Arquero y centrales, con menos peso (sus rebotes inflan el
// puntaje del partido)
const SERIE: Record<string, number> = { ...PRESTIGIO, C: 0.4, FC: 0.8, PF: 0.8 };
const partido = (_pos: string, factor: number) =>
	`${factor} * (gmsc + 0.4*(stl + blk) + 0.3*ast) * (1 + 0.75*won) * min(1, min/45)`;

const premio = (
	shortName: string,
	name: string,
	showStats: "offense" | "defense",
	resto: Record<string, unknown>,
) => ({ shortName, name, showStats, ...resto });

export const PREMIOS = [
	// --- Los grandes
	premio("BDO", "Ballon d'Or", "offense", {
		actAs: "mvp",
		formula: temporada("SG", PRESTIGIO.SG!),
		formulaByPos: porPuesto(PRESTIGIO, temporada),
	}),
	// Uno por zona: el juego antepone el nombre corto de la zona
	// (Metropolitano / Federal, en cargar-plantel.ts)
	premio("ZPOY", "Player of the Year", "offense", {
		group: "conf",
		formula: temporada("SG", PRESTIGIO.SG!),
		formulaByPos: porPuesto(PRESTIGIO, temporada),
	}),
	premio("Golden Boot", "Golden Boot", "offense", {
		formula: "pts*gp*(0.85 + 0.3*tsp/100)",
	}),
	premio("PMK", "Playmaker of the Year", "offense", {
		formula: "ast*gp*(1 + astp/100) - 0.25*tov*gp",
	}),
	premio("Golden Glove", "Golden Glove", "defense", {
		formula: FUERA,
		formulaByPos: porPuesto(solo(["C"]), () =>
			`${participacion(2700, 1.2)} * ((dbpm + 3) + 0.3*blk + 0.08*drb + 0.1*stl) * (0.7 + 0.6*winp)`,
		),
	}),
	premio("DPOY", "Defender of the Year", "defense", {
		formula: FUERA,
		formulaByPos: porPuesto(
			// Pivote 0,75: con 0,85 Paredes igual ganó en 2026
			{ FC: 1, PF: 1, GF: 1.12, G: 0.75 },
			(_pos, factor) =>
				`${factor} * ${participacion(2700, 1.5)} * (2*(dbpm + 3)/3 + 0.15*gs/max(gp, 1)) * (0.75 + 0.5*winp) + 0.25*seasonFraction*winp`,
		),
	}),
	premio("ROY", "Breakthrough of the Year", "offense", {
		actAs: "roy",
		rookie: true,
		formula: temporada("SG", PRESTIGIO.SG!, 1800),
		formulaByPos: porPuesto({ ...PRESTIGIO, C: 0.45 }, (pos, f) => temporada(pos, f, 1800)),
	}),
	premio("SUB", "Super Sub of the Year", "offense", {
		bench: true,
		formula: FUERA,
		// El revulsivo es casi siempre de mitad de cancha para adelante; el
		// arquero suplente, afuera
		formulaByPos: porPuesto(
			{ F: 1, SF: 1, PG: 1, SG: 0.95, G: 0.95, GF: 0.9, FC: 0.85, PF: 0.85 },
			(_pos, f) =>
				`${f} * min(1, gp/20) * ${participacion(900, 1.2)} * (per/15 + (obpm + dbpm + 3)/3) * (0.85 + 0.3*winp)`,
		),
	}),
	premio("MIP", "Most Improved Player", "offense", {
		mip: true,
		// Mejora de nivel, no de minutos: el umbral bajo (600') hace que pasar de
		// suplente a titular no cuente como progreso (en 2027 lo ganaba José
		// Sosa, de 42 años, por haber jugado más)
		formula: "min(1, gp*min/600)^0.5 * (per/15 + (obpm + dbpm + 3)/3)",
	}),
	// --- Los mejores de cada puesto
	premio("STR", "Striker of the Year", "offense", {
		formula: FUERA,
		formulaByPos: porPuesto(solo(["F"]), temporada),
	}),
	premio("WNG", "Winger of the Year", "offense", {
		formula: FUERA,
		formulaByPos: porPuesto(solo(["SF"]), temporada),
	}),
	premio("N10", "Number 10 of the Year", "offense", {
		formula: FUERA,
		formulaByPos: porPuesto(solo(["PG"]), temporada),
	}),
	premio("MID", "Midfielder of the Year", "offense", {
		formula: FUERA,
		formulaByPos: porPuesto({ G: 1.05, SG: 1 }, temporada),
	}),
	premio("FB", "Full-Back of the Year", "defense", {
		formula: FUERA,
		formulaByPos: porPuesto(solo(["GF"]), temporada),
	}),
	premio("CB", "Center-Back of the Year", "defense", {
		formula: FUERA,
		formulaByPos: porPuesto(solo(["FC", "PF"]), temporada),
	}),
	// --- Liguilla (playoffs)
	premio("LMVP", "Liguilla MVP", "offense", {
		statRange: "playoffs",
		formula: "(min(gp, 4)/4)^0.7 * min(1, min/60) * (per/15 + (obpm + dbpm + 3)/3)",
		formulaByPos: porPuesto(
			SERIE,
			(_pos, f) => `${f} * (min(gp, 4)/4)^0.7 * min(1, min/60) * (per/15 + (obpm + dbpm + 3)/3)`,
		),
	}),
	premio("FMVP", "Finals MVP", "offense", {
		statRange: -1,
		formula: partido("SG", 1),
		formulaByPos: porPuesto(SERIE, partido),
	}),
	// --- Equipos de la temporada (de a 5: así son en el juego). Con el Golden
	// Glove forman 16: arquero, defensa, medio y ataque
	premio("TOTS-D", "Team of the Season: Defense", "defense", {
		numTeams: 1,
		formula: FUERA,
		// Los laterales sacan entre 60% y 66% de lo que sacan los centrales
		// (dos temporadas simuladas): con 1,5 salen en promedio dos o tres de
		// cada uno (en un equipo de 5 no se pueden fijar puestos)
		formulaByPos: porPuesto({ FC: 1, PF: 1, GF: 1.5 }, temporada),
	}),
	premio("TOTS-M", "Team of the Season: Midfield", "offense", {
		numTeams: 1,
		formula: FUERA,
		// Los mediapuntas sacan ~1,75 veces lo de pivotes y volantes: con 0,55
		// queda un medio mezclado (en promedio, dos enganches)
		formulaByPos: porPuesto({ G: 1, SG: 1.05, PG: 0.55 }, temporada),
	}),
	premio("TOTS-A", "Team of the Season: Attack", "offense", {
		numTeams: 1,
		formula: FUERA,
		// Con +20%, dos nueves y tres extremos en las dos temporadas de la liga
		// del usuario (con +10%, uno solo en 2026)
		formulaByPos: porPuesto({ SF: 1, F: 1.2 }, temporada),
	}),
	premio("All-Rookie", "Rookie Team of the Season", "offense", {
		numTeams: 1,
		rookie: true,
		formula: temporada("SG", PRESTIGIO.SG!, 1800),
		formulaByPos: porPuesto({ ...PRESTIGIO, C: 0.45 }, (pos, f) => temporada(pos, f, 1800)),
	}),
];
