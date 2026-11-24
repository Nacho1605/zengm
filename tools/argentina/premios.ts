// Premios de fin de temporada de la liga (desde la v2.24.2; pedido del
// usuario: "reformular de manera creativa todos los premios", con fórmulas
// que se amolden al fútbol y no den sorpresas). Ver data/argentina/premios.md.
//
// Bases (el motor juega básquet por dentro, ver activar-futbol.ts):
// - Nunca se usan las WS (ws, ows): con 11 en cancha, una cuenta del motor
//   (qAst, con un 5 fijo) las dispara en jugadores de pocos minutos que
//   convierten mucho (caso Barbieri, All-Star con 12 minutos).
// - Se usan medidas que el motor ya pone en la escala de la liga: PER (15 =
//   promedio), BPM ofensivo y defensivo (0 = promedio) y % de victorias.
// - Participación: (minutos jugados / umbral) con tope 1, elevada a una
//   potencia: el que jugó poco no puede ganar aunque sus números por minuto
//   sean enormes. 2700' = 30 partidos completos de 43.
// - Cada puesto pesa distinto lo ofensivo y lo defensivo (fórmula por
//   puesto): un central se mide sobre todo por cómo defiende, un delantero
//   por cómo ataca.

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
// Peso del puesto en los premios generales (realidad del fútbol: los
// premios grandes los ganan sobre todo los que atacan; un arquero o un
// central tiene que destacarse mucho más que el resto para ganarlos)
export const PRESTIGIO: Record<string, number> = {
	F: 1,
	SF: 1,
	PG: 1,
	SG: 0.96,
	G: 0.92,
	GF: 0.88,
	FC: 0.85,
	PF: 0.85,
	C: 0.75,
};
const PUESTOS = Object.keys(PESOS);
const FUERA = "-1000 + 0*gp";

const participacion = (umbral: number, potencia: number) =>
	`min(1, gp*min/${umbral})^${potencia}`;
// Rendimiento según el puesto: ataque (PER y BPM ofensivo) y defensa (BPM
// defensivo), los dos con promedio cerca de 2
const nucleo = (pos: string) => {
	const [o, d] = PESOS[pos]!;
	return `${PRESTIGIO[pos]} * (${o}*(per/15 + (obpm + 3)/3) + ${d}*2*(dbpm + 3)/3)`;
};
const balonDeOro = (pos: string) =>
	`${participacion(2700, 1.5)} * ${nucleo(pos)} * (0.8 + 0.4*winp) + 0.3*seasonFraction*winp`;
const revelacion = (pos: string) =>
	`${participacion(1800, 1.5)} * ${nucleo(pos)} * (0.9 + 0.2*winp)`;
const porPuesto = (f: (pos: string) => string, puestos = PUESTOS) =>
	Object.fromEntries(PUESTOS.map((p) => [p, puestos.includes(p) ? f(p) : FUERA]));

const DEFENSA = ["FC", "PF", "GF", "G"];
const ATAQUE = ["SG", "PG", "SF", "F"];
const candado = (pos: string) =>
	`${participacion(2700, 1.5)} * (2*(dbpm + 3)/3 + 0.15*gs/max(gp, 1)) * (0.75 + 0.5*winp)${pos === "SG" ? " * 0.9" : ""} + 0.25*seasonFraction*winp`;

export const PREMIOS = [
	{
		shortName: "ORO",
		name: "Balón de Oro",
		actAs: "mvp",
		formula: balonDeOro("SG"),
		formulaByPos: porPuesto(balonDeOro),
		showStats: "offense",
	},
	{
		shortName: "BOT",
		name: "Botín de Oro",
		formula: "pts*gp*(0.85 + 0.3*tsp/100)",
		showStats: "offense",
	},
	{
		shortName: "GUA",
		name: "Guante de Oro",
		formula: FUERA,
		formulaByPos: porPuesto(
			() =>
				`${participacion(2700, 1.2)} * ((dbpm + 3) + 0.3*blk + 0.08*drb + 0.1*stl) * (0.7 + 0.6*winp)`,
			["C"],
		),
		showStats: "defense",
	},
	{
		shortName: "CAN",
		name: "Candado de Oro",
		formula: FUERA,
		formulaByPos: porPuesto(candado, [...DEFENSA, "SG"]),
		showStats: "defense",
	},
	{
		shortName: "PAS",
		name: "Maestro del Pase",
		formula: "ast*gp*(1 + astp/100) - 0.25*tov*gp",
		showStats: "offense",
	},
	{
		shortName: "REV",
		name: "Revelación del Año",
		actAs: "roy",
		rookie: true,
		formula: revelacion("SG"),
		formulaByPos: porPuesto(revelacion),
		showStats: "offense",
	},
	{
		shortName: "RVS",
		name: "Revulsivo del Año",
		bench: true,
		formula: `min(1, gp/20) * ${participacion(900, 1.2)} * (per/15 + (obpm + dbpm + 3)/3) * (0.85 + 0.3*winp)`,
		showStats: "offense",
	},
	{
		shortName: "PRO",
		name: "Mayor Progreso",
		mip: true,
		formula: `${participacion(2000, 1)} * (per/15 + (obpm + dbpm + 3)/3 + 0.5)`,
		showStats: "offense",
	},
	{
		shortName: "LIG",
		name: "Figura de la Liguilla",
		statRange: "playoffs",
		formula: "(min(gp, 4)/4)^0.7 * min(1, min/60) * (per/15 + (obpm + dbpm + 3)/3)",
		showStats: "offense",
	},
	{
		shortName: "FIN",
		name: "Figura de la Final",
		statRange: -1,
		formula: "(gmsc + 0.4*(stl + blk) + 0.2*ast) * (1 + 0.75*won) * min(1, min/45)",
		showStats: "offense",
	},
	{
		shortName: "SEM",
		name: "Figura de la Semifinal",
		statRange: -2,
		formula: "(gmsc + 0.4*(stl + blk) + 0.2*ast) * (1 + 0.75*won) * min(1, min/45)",
		showStats: "offense",
	},
	{
		shortName: "EID",
		name: "Equipo Ideal: Defensa",
		formula: FUERA,
		formulaByPos: porPuesto(balonDeOro, DEFENSA),
		showStats: "defense",
		numTeams: 1,
	},
	{
		shortName: "EIA",
		name: "Equipo Ideal: Medio y Ataque",
		formula: FUERA,
		formulaByPos: porPuesto(balonDeOro, ATAQUE),
		showStats: "offense",
		numTeams: 1,
	},
	{
		shortName: "EIR",
		name: "Equipo Ideal de Revelaciones",
		rookie: true,
		formula: revelacion("SG"),
		formulaByPos: porPuesto(revelacion),
		showStats: "offense",
		numTeams: 1,
	},
];
