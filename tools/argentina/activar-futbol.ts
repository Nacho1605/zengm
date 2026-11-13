// Activa las reglas de fútbol en un archivo de liga de BBGM Argentina. Uso:
//
//   node tools/argentina/activar-futbol.ts ENTRADA.json SALIDA.json
//
// Con 11 en cancha, el motor modificado de este fork entra en "modo fútbol"
// (formación, cambios, arquero, penales, generación de jugadores por posición).
// Este script además ajusta la duración del partido y los desempates.

import { readFileSync, writeFileSync } from "node:fs";

const [input, output] = process.argv.slice(2);
if (!input || !output) {
	throw new Error("Uso: node activar-futbol.ts ENTRADA.json SALIDA.json");
}

const league = JSON.parse(readFileSync(input, "utf8"));
const ga = league.gameAttributes;

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
};

for (const [key, value] of Object.entries(cambios)) {
	const before = JSON.stringify(ga[key]);
	ga[key] = value;
	console.log(`${key}: ${before ?? "(no estaba)"} -> ${JSON.stringify(value)}`);
}

writeFileSync(output, JSON.stringify(league));
