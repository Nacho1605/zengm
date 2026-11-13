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

// Lesiones en español. Misma frecuencia y duración (en partidos) que la lista
// por defecto de BBGM para básquet; solo cambia el nombre.
const LESIONES = [
	{ name: "Esguince de tobillo", frequency: 1520, games: 6.41 }, // Sprained Ankle
	{ name: "Molestias en la rodilla", frequency: 809, games: 6.52 }, // Sore Knee
	{ name: "Dolor de espalda", frequency: 566, games: 4.51 }, // Sore Back
	{ name: "Desgarro en el isquiotibial", frequency: 529, games: 8.3 }, // Strained Hamstring
	{ name: "Desgarro en el gemelo", frequency: 454, games: 8.48 }, // Strained Calf
	{ name: "Molestias en el tobillo", frequency: 375, games: 4.44 }, // Sore Ankle
	{ name: "Pubalgia", frequency: 354, games: 5.44 }, // Strained Groin
	{ name: "Molestias en el pie", frequency: 305, games: 6.31 }, // Sore Foot
	{ name: "Molestias en la cadera", frequency: 302, games: 5.57 }, // Sore Hip
	{ name: "Golpe en la rodilla", frequency: 261, games: 6.16 }, // Bruised Knee
	{ name: "Esguince de rodilla", frequency: 248, games: 11.73 }, // Sprained Knee
	{ name: "Conmoción cerebral", frequency: 198, games: 4.19 }, // Concussion
	{ name: "Molestias en el tendón de Aquiles", frequency: 182, games: 4.44 }, // Sore Achilles
	{ name: "Contractura en la espalda", frequency: 168, games: 3.9 }, // Back Spasms
	{ name: "Golpe en la cadera", frequency: 160, games: 3.42 }, // Bruised Hip
	{ name: "Molestias en el hombro", frequency: 150, games: 6.89 }, // Sore Shoulder
	{ name: "Golpe en el cuádriceps", frequency: 145, games: 3.97 }, // Bruised Quadriceps
	{ name: "Tendinitis rotuliana", frequency: 145, games: 5.61 }, // Patellar Tendinitis
	{ name: "Esguince en un dedo del pie", frequency: 130, games: 7 }, // Sprained Toe
	{ name: "Esguince en el pie", frequency: 120, games: 6.9 }, // Sprained Foot
	{ name: "Golpe en la pierna", frequency: 116, games: 3.78 }, // Bruised Leg
	{ name: "Esguince de muñeca", frequency: 114, games: 7.78 }, // Sprained Wrist
	{ name: "Golpe en la espalda", frequency: 111, games: 5.18 }, // Bruised Back
	{ name: "Esguince en el pulgar", frequency: 103, games: 5.65 }, // Sprained Thumb
	{ name: "Esguince de hombro", frequency: 89, games: 7.89 }, // Sprained Shoulder
	{ name: "Fascitis plantar", frequency: 86, games: 6.28 }, // Plantar Fasciitis
	{ name: "Fractura en la mano", frequency: 83, games: 14.75 }, // Fractured Hand
	{ name: "Golpe en el pie", frequency: 79, games: 6.7 }, // Bruised Foot
	{ name: "Fractura en un dedo de la mano", frequency: 68, games: 10.94 }, // Fractured Finger
	{ name: "Molestias en el cuádriceps", frequency: 62, games: 4.38 }, // Sore Quadriceps
	{ name: "Golpe en la mano", frequency: 50, games: 3.95 }, // Bruised Hand
	{ name: "Fractura de nariz", frequency: 50, games: 6.25 }, // Fractured Nose
	{ name: "Desgarro en el cuádriceps", frequency: 50, games: 7.66 }, // Strained Quadriceps
	{ name: "Golpe en el hombro", frequency: 48, games: 6.92 }, // Bruised Shoulder
	{ name: "Molestias en el codo", frequency: 43, games: 6.8 }, // Sore Elbow
	{ name: "Desgarro abdominal", frequency: 43, games: 9.51 }, // Strained Abdomen
	{ name: "Rotura del ligamento cruzado", frequency: 43, games: 111 }, // Torn ACL
	{ name: "Esguince de codo", frequency: 41, games: 7.67 }, // Sprained Elbow
	{ name: "Molestias en la muñeca", frequency: 41, games: 6.76 }, // Sore Wrist
	{ name: "Fractura de tobillo", frequency: 39, games: 27.06 }, // Fractured Ankle
	{ name: "Fractura en el pie", frequency: 39, games: 33.9 }, // Fractured Foot
	{ name: "Contractura cervical", frequency: 39, games: 6.63 }, // Strained Neck
	{ name: "Molestias en un dedo del pie", frequency: 39, games: 2.49 }, // Sore Toe
	{ name: "Rotura de menisco", frequency: 39, games: 29.03 }, // Torn Meniscus
	{ name: "Molestias en la mano", frequency: 37, games: 3.6 }, // Sore Hand
	{ name: "Esguince en la mano", frequency: 36, games: 7.08 }, // Sprained Hand
	{ name: "Desgarro en el oblicuo", frequency: 36, games: 7.92 }, // Strained Oblique
	{ name: "Contusión en las costillas", frequency: 32, games: 3.67 }, // Rib Contusion
	{ name: "Esguince en un dedo de la mano", frequency: 32, games: 7.92 }, // Sprained Finger
	{ name: "Rotura del tendón de Aquiles", frequency: 23, games: 111 }, // Torn Achilles Tendon
	{ name: "Molestias en el cuello", frequency: 22, games: 5.31 }, // Sore Neck
	{ name: "Golpe en el ojo", frequency: 18, games: 1.35 }, // Bruised Eye
	{ name: "Fractura de costilla", frequency: 18, games: 9.53 }, // Fractured Rib
	{ name: "Hernia de disco", frequency: 18, games: 18.82 }, // Herniated Disc
	{ name: "Molestias en el pulgar", frequency: 18, games: 5.4 }, // Sore Thumb
	{ name: "Golpe en el codo", frequency: 16, games: 1.99 }, // Bruised Elbow
	{ name: "Contusión en el tobillo", frequency: 14, games: 5.59 }, // Ankle Contusion
	{ name: "Fractura en un dedo del pie", frequency: 9, games: 12.28 }, // Fractured Toe
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

	// Tarjetas: cada falta registrada es una amarilla, y con 2 el jugador queda
	// expulsado. Con esta tasa salen unas 2,4 amarillas por equipo y por partido
	// con los planteles reales del archivo.
	foulRateFactor: 2,
	foulsNeededToFoulOut: 2,

	// Sin Partido de las Estrellas (con concurso de volcadas y de triples)
	allStarGame: null,

	// Lesiones con nombres en español
	injuries: LESIONES,
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
