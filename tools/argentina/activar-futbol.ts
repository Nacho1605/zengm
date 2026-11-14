// Activa las reglas de fútbol en un archivo de liga de BBGM Argentina. Uso:
//
//   node tools/argentina/activar-futbol.ts ENTRADA.json SALIDA.json
//
// Todo se hace con ajustes del archivo, así que funciona en la página oficial
// (play.basketball-gm.com): partidos de básquet con 11 en cancha y dos tiempos
// de 45 minutos.

import { readFileSync, writeFileSync } from "node:fs";
import { INJURY_RATE, LESIONES } from "./lesiones.ts";

const [input, output] = process.argv.slice(2);
if (!input || !output) {
	throw new Error("Uso: node activar-futbol.ts ENTRADA.json SALIDA.json");
}

const league = JSON.parse(readFileSync(input, "utf8"));
const ga = league.gameAttributes;

const PREMIOS = [
	{
		actAs: "mvp",
		formula:
			"ewa / 22 + vorp / 32 + min(ws/max(teamWs,ws),0.8) / 10 + seasonFraction * winp",
		name: "Jugador Más Valioso",
		shortName: "MVP",
		showStats: "offense",
	},
	{
		formula:
			"dws/3.1 + seasonFraction * winp + gp / 43 * (blk / 4.1 + stl / 1.8)",
		name: "Mejor Defensor",
		shortName: "MD",
		showStats: "defense",
	},
	{
		actAs: "roy",
		formula: "ewa / 2.1 + vorp + gp / 43 * pts / 2",
		name: "Revelación del Año",
		rookie: true,
		shortName: "REV",
		showStats: "offense",
	},
	{
		bench: true,
		formula:
			"ewa / 5.5 + vorp / 2.3 + ws / 4.9 + seasonFraction * winp + gp / 43 * pts / 9.9",
		name: "Mejor Suplente",
		shortName: "SUP",
		showStats: "offense",
	},
	{
		formula: "pts + trb + ast + per",
		mip: true,
		name: "Jugador de Mayor Progreso",
		shortName: "PRO",
		showStats: "offense",
	},
	{
		formula: "gmsc * (1 + 0.75*won)",
		name: "Figura de la Final",
		shortName: "FIN",
		showStats: "offense",
		statRange: -1,
	},
	{
		formula: "gmsc * (1 + 0.75*won)",
		name: "Figura de Semifinal",
		shortName: "SEMI",
		showStats: "offense",
		statRange: -2,
	},
	{
		formula:
			"ewa / 22 + vorp / 32 + min(ws/max(teamWs,ws),0.8) / 10 + seasonFraction * winp",
		name: "Equipo Ideal",
		numTeams: 3,
		shortName: "IDEAL",
		showStats: "offense",
	},
	{
		formula:
			"dws/3.1 + seasonFraction * winp + gp / 43 * (blk / 4.1 + stl / 1.8)",
		name: "Equipo Ideal Defensivo",
		numTeams: 2,
		shortName: "DEF",
		showStats: "defense",
	},
	{
		formula: "ewa / 2.1 + vorp + gp / 43 * pts / 2",
		name: "Equipo Ideal de Revelaciones",
		numTeams: 2,
		rookie: true,
		shortName: "REVS",
		showStats: "offense",
	},
];

// Algunos ajustes se guardan con historial por temporada
const fromStart = <T>(value: T) => [{ start: null, value }];

const cambios: Record<string, unknown> = {
	// Partido: 11 por equipo, dos tiempos de 45 minutos
	numPlayersOnCourt: 11,
	numPeriods: 2,
	quarterLength: 45,

	// Liga: si termina empatado, es empate (sin prórroga ni penales)
	maxOvertimes: fromStart(0),
	shootoutRounds: fromStart(0),

	// Eliminación directa: 30 minutos de alargue y, si sigue empatado, penales
	maxOvertimesPlayoffs: 1,
	overtimeLengthPlayoffs: 30,
	shootoutRoundsPlayoffs: 5,

	// Playoffs: 4 rondas a partido único (octavos, cuartos, semis y final). El
	// mejor ubicado es local, y la final es en cancha neutral.
	numGamesPlayoffSeries: fromStart([1, 1, 1, 1]),
	neutralSite: "finals",

	// Tabla por puntos: 3 por victoria, 1 por empate. Desempate por diferencia
	// de gol, después enfrentamiento directo.
	pointsFormula: fromStart("3*W+T"),
	tiebreakers: fromStart(["marginOfVictory", "headToHeadRecord", "coinFlip"]),

	// Ajustes para que el motor OFICIAL de play.basketball-gm.com dé partidos de
	// básquet normales con 11 en cancha y 90 minutos. Medidos con los planteles
	// reales del archivo contra el código oficial: unos 105 puntos por equipo,
	// 45% de acierto, 10 triples, 6 tapones y 16 pérdidas por partido.
	// - Ritmo: con 90 minutos, el ritmo de la NBA (100) daba unos 190 puntos.
	pace: 55,
	// - Puntería y tapones: con 11 defensores, el motor oficial suma su defensa
	//   como si fueran jugadores de básquet de más, y el acierto caía al 25%.
	twoPointAccuracyFactor: 1.4,
	threePointAccuracyFactor: 1.4,
	blockFactor: 0.4,
	// - Pocas faltas (el valor del archivo 2023). Con más faltas, el motor
	//   oficial da decenas de libres por partido.
	foulRateFactor: 0.01,
	// - Con 2 faltas el jugador sale del partido.
	foulsNeededToFoulOut: 2,

	// Temporada por zonas, como en el fútbol argentino: 2 partidos contra cada
	// rival de la zona (28) y 1 contra cada equipo de la otra zona (15). Con
	// numGamesDiv vacío, los rivales de la división cuentan como rivales de zona;
	// si se pusiera un número, el juego lo rechazaría (hay divisiones de un solo
	// equipo) y armaría el fixture al azar. Necesita 2 zonas de 15 equipos.
	numGames: 43,
	numGamesConf: 28,
	numGamesDiv: null,

	// Cierre del libro de pases a mitad de temporada, como el receso de invierno
	tradeDeadline: 0.5,

	// Paridad: masa salarial mínima más alta (el tope salarial rígido ya
	// estaba). equalizeRegions queda apagado para respetar la población real de
	// cada club.
	equalizeRegions: false,
	minPayroll: 120000,

	// Planteles de fútbol: de 22 a 36 jugadores (en 2026, Belgrano tiene 25 y
	// Platense 36)
	minRosterSize: 22,
	maxRosterSize: 36,

	// Premios en español (mismas fórmulas que la NBA, por partidos jugados de 43)
	awards: PREMIOS,

	// Partido de las Estrellas a mitad de temporada, Metropolitano contra
	// Federal, con 18 convocados por equipo (11 titulares y 7 suplentes)
	allStarGame: 0.7,
	allStarNum: 18,
	allStarType: "byConf",

	// Lesiones de fútbol, en español (ver lesiones.ts)
	injuries: LESIONES,
	injuryRate: INJURY_RATE,
};

// Ajuste viejo de BBGM: al importar el archivo, "ties: false" se convierte en
// prórrogas infinitas y pisaría maxOvertimes, así que nunca habría empates
if ("ties" in ga) {
	console.log(`ties: ${JSON.stringify(ga.ties)} -> (borrado)`);
	delete ga.ties;
}

for (const [key, value] of Object.entries(cambios)) {
	const before = JSON.stringify(ga[key]);
	ga[key] = value;
	console.log(`${key}: ${before ?? "(no estaba)"} -> ${JSON.stringify(value)}`);
}

writeFileSync(output, JSON.stringify(league));
