// Lesiones de fútbol para el motor oficial de BBGM.
//
// Duración: el juego cuenta la lesión en partidos, y la temporada tiene 43, así
// que 1 partido ≈ 1 semana. El valor es el promedio: el juego lo multiplica
// por un número al azar entre 0,25 y 1,75 (y por el efecto del presupuesto de
// salud).
//
// Frecuencia: peso relativo de cada lesión, con la distribución típica del
// fútbol (más lesiones musculares y de tobillo/rodilla, casi nada en manos y
// brazos). Los nombres son los mismos de la lista anterior.
export const LESIONES = [
	{ name: "Desgarro en el isquiotibial", frequency: 1400, games: 3.5 },
	{ name: "Esguince de tobillo", frequency: 1000, games: 3 },
	{ name: "Desgarro en el gemelo", frequency: 550, games: 3 },
	{ name: "Pubalgia", frequency: 450, games: 4 },
	{ name: "Desgarro en el cuádriceps", frequency: 450, games: 3.5 },
	{ name: "Molestias en la rodilla", frequency: 450, games: 1.5 },
	{ name: "Esguince de rodilla", frequency: 400, games: 5 },
	{ name: "Golpe en la rodilla", frequency: 300, games: 1 },
	{ name: "Golpe en el cuádriceps", frequency: 300, games: 1 },
	{ name: "Golpe en la pierna", frequency: 300, games: 1 },
	{ name: "Molestias en el tobillo", frequency: 300, games: 1.5 },
	{ name: "Molestias en el cuádriceps", frequency: 250, games: 1.5 },
	{ name: "Dolor de espalda", frequency: 200, games: 1.5 },
	{ name: "Molestias en el pie", frequency: 200, games: 1.5 },
	{ name: "Golpe en el pie", frequency: 200, games: 1 },
	{ name: "Rotura del ligamento cruzado", frequency: 180, games: 32 },
	{ name: "Molestias en el tendón de Aquiles", frequency: 150, games: 2 },
	{ name: "Tendinitis rotuliana", frequency: 150, games: 2.5 },
	{ name: "Contractura en la espalda", frequency: 150, games: 1 },
	{ name: "Molestias en la cadera", frequency: 150, games: 2 },
	{ name: "Contusión en el tobillo", frequency: 150, games: 1 },
	{ name: "Rotura de menisco", frequency: 120, games: 8 },
	{ name: "Golpe en la cadera", frequency: 120, games: 1 },
	{ name: "Esguince en el pie", frequency: 100, games: 3 },
	{ name: "Conmoción cerebral", frequency: 80, games: 1.5 },
	{ name: "Desgarro abdominal", frequency: 80, games: 3 },
	{ name: "Golpe en la espalda", frequency: 80, games: 1 },
	{ name: "Contusión en las costillas", frequency: 80, games: 1.5 },
	{ name: "Fractura en el pie", frequency: 70, games: 10 },
	{ name: "Esguince en un dedo del pie", frequency: 60, games: 2 },
	{ name: "Fascitis plantar", frequency: 60, games: 5 },
	{ name: "Desgarro en el oblicuo", frequency: 50, games: 3 },
	{ name: "Esguince de hombro", frequency: 50, games: 4 },
	{ name: "Molestias en el hombro", frequency: 40, games: 1.5 },
	{ name: "Golpe en el hombro", frequency: 40, games: 1 },
	{ name: "Fractura de nariz", frequency: 40, games: 1.5 },
	{ name: "Contractura cervical", frequency: 40, games: 1 },
	{ name: "Molestias en un dedo del pie", frequency: 40, games: 1 },
	{ name: "Fractura en un dedo del pie", frequency: 40, games: 4 },
	{ name: "Molestias en el cuello", frequency: 30, games: 1 },
	{ name: "Fractura de costilla", frequency: 30, games: 4 },
	{ name: "Fractura de tobillo", frequency: 25, games: 14 },
	{ name: "Esguince de muñeca", frequency: 25, games: 1.5 },
	{ name: "Fractura en la mano", frequency: 20, games: 3 },
	{ name: "Fractura en un dedo de la mano", frequency: 20, games: 2 },
	{ name: "Golpe en el ojo", frequency: 20, games: 1 },
	{ name: "Hernia de disco", frequency: 20, games: 8 },
	{ name: "Rotura del tendón de Aquiles", frequency: 15, games: 30 },
	{ name: "Esguince en el pulgar", frequency: 15, games: 1 },
	{ name: "Golpe en la mano", frequency: 15, games: 1 },
	{ name: "Molestias en la muñeca", frequency: 15, games: 1 },
	{ name: "Esguince en un dedo de la mano", frequency: 15, games: 1 },
	{ name: "Molestias en el codo", frequency: 10, games: 1 },
	{ name: "Esguince de codo", frequency: 10, games: 1.5 },
	{ name: "Molestias en la mano", frequency: 10, games: 1 },
	{ name: "Esguince en la mano", frequency: 10, games: 1.5 },
	{ name: "Molestias en el pulgar", frequency: 10, games: 1 },
	{ name: "Golpe en el codo", frequency: 10, games: 1 },
];

// Probabilidad de lesión por jugador en cancha y por posesión. Con 22 en
// cancha, ritmo 55 y unas 200 posesiones por partido, da unas 5 lesiones por
// equipo en las 43 fechas (el valor anterior, 0,0000125, daba unas 2).
export const INJURY_RATE = 0.00003;
