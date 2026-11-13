// Actualiza la configuración biográfica (playerBioInfo) de un archivo de liga
// de BBGM Argentina. Uso:
//
//   node tools/argentina/actualizar-bio.ts ENTRADA.json SALIDA.json
//
// Cambios:
// 1. Nombres argentinos: base = nombres reales de los futbolistas argentinos del
//    propio archivo (peso x3), más la lista anterior sin errores claros.
// 2. Ecuador: se agregan nombres. Sin esto el juego tira un error al generar
//    un jugador ecuatoriano.
// 3. Clubes de formación ("college"): Argentina usa los clubes de la liga; los
//    países sudamericanos usan sus clubes principales. Ningún país cae en las
//    universidades de EE.UU. que BBGM usa por defecto.

import { readFileSync, writeFileSync } from "node:fs";

const [input, output] = process.argv.slice(2);
if (!input || !output) {
	throw new Error("Uso: node actualizar-bio.ts ENTRADA.json SALIDA.json");
}

const league = JSON.parse(readFileSync(input, "utf8"));
const bio = league.gameAttributes.playerBioInfo;

// ---------------------------------------------------------------------------
// 1. Nombres argentinos

// Errores claros de la lista anterior: nombres femeninos, errores de tipeo,
// palabras que no son nombres y nombre+apellido juntos
const NOMBRES_A_QUITAR = new Set([
	"Abril",
	"Idoia",
	"Kimberly",
	"Milagros",
	"Luz",
	"Gitana",
	"Emesto",
	"Gillermo",
	"Macos",
	"Feo",
	"Pueblo",
	"Toro",
	"Tajo",
	"Tauro",
	"Quinto",
	"Terciero",
	"Primeiro",
	"Gerard Gómez",
	"Jaime Gómez",
	"Pau Carpintero",
]);
const APELLIDOS_A_QUITAR = new Set(["Quesads", "Mendonza"]);

const PESO_REALES = 3;

const contar = (values: string[]) => {
	const counts: Record<string, number> = {};
	for (const value of values) {
		const v = value.trim();
		if (v !== "") {
			counts[v] = (counts[v] ?? 0) + 1;
		}
	}
	return counts;
};

const argentinos = league.players.filter(
	(p: any) => p.born?.loc === "Argentina",
);
const nombresReales = contar(argentinos.map((p: any) => p.firstName));
const apellidosReales = contar(argentinos.map((p: any) => p.lastName));

const combinar = (
	reales: Record<string, number>,
	anteriores: Record<string, number>,
	quitar: Set<string>,
) => {
	const result: Record<string, number> = {};
	for (const [name, count] of Object.entries(anteriores)) {
		if (!quitar.has(name)) {
			result[name] = count;
		}
	}
	for (const [name, count] of Object.entries(reales)) {
		result[name] = (result[name] ?? 0) + PESO_REALES * count;
	}
	return result;
};

const ar = bio.countries.Argentina;
const antesNombres = Object.keys(ar.first).length;
const antesApellidos = Object.keys(ar.last).length;
ar.first = combinar(nombresReales, ar.first, NOMBRES_A_QUITAR);
ar.last = combinar(apellidosReales, ar.last, APELLIDOS_A_QUITAR);

// La lista de nombres de Uruguay es casi una copia de la argentina, con los
// mismos errores
const uy = bio.countries.Uruguay;
if (uy?.first) {
	for (const name of NOMBRES_A_QUITAR) {
		delete uy.first[name];
	}
}

// ---------------------------------------------------------------------------
// 2. Ecuador

const ECUADOR_NOMBRES = [
	"Moisés",
	"Piero",
	"Kendry",
	"Pervis",
	"Jhegson",
	"Ángelo",
	"Enner",
	"Gonzalo",
	"William",
	"Jordy",
	"Félix",
	"Alan",
	"Carlos",
	"José",
	"Byron",
	"Michael",
	"Cristhian",
	"Jefferson",
	"Joao",
	"Jackson",
	"Ángel",
	"Hernán",
	"Jhon",
	"Kevin",
	"Walter",
	"Édison",
	"Luis",
	"Segundo",
	"Romario",
	"Washington",
	"Antonio",
	"Darwin",
	"Jhonny",
	"Robert",
	"Juan",
	"Diego",
	"Pedro",
	"Erick",
	"Bryan",
	"Xavier",
];
const ECUADOR_APELLIDOS = [
	"Caicedo",
	"Valencia",
	"Estupiñán",
	"Hincapié",
	"Plata",
	"Preciado",
	"Arboleda",
	"Mena",
	"Quiñónez",
	"Cortez",
	"Angulo",
	"Castillo",
	"Mina",
	"Ayoví",
	"Delgado",
	"Méndez",
	"Sornoza",
	"Pacho",
	"Torres",
	"Sarmiento",
	"Paz",
	"Corozo",
	"Bolaños",
	"Ibarra",
	"Gruezo",
	"Noboa",
	"Rodríguez",
	"Vera",
	"Franco",
	"Hurtado",
	"Montero",
	"Cifuentes",
	"Alcívar",
	"Cevallos",
	"Chalá",
	"Porozo",
	"Jiménez",
	"Reasco",
	"Folleco",
	"Arroyo",
];
const ecuatorianos = league.players.filter(
	(p: any) => p.born?.loc === "Ecuador",
);
bio.countries.Ecuador = {
	...bio.countries.Ecuador,
	first: combinar(
		contar(ecuatorianos.map((p: any) => p.firstName)),
		Object.fromEntries(ECUADOR_NOMBRES.map((n) => [n, 1])),
		new Set(),
	),
	last: combinar(
		contar(ecuatorianos.map((p: any) => p.lastName)),
		Object.fromEntries(ECUADOR_APELLIDOS.map((n) => [n, 1])),
		new Set(),
	),
};

// ---------------------------------------------------------------------------
// 3. Clubes de formación

// Argentina: los clubes del propio archivo, con su nombre en el juego.
// Peso 6 = canteras más reconocidas, 3 = resto de la Liga Profesional,
// 1 = clubes del ascenso (desactivados en la liga).
const CANTERAS_TOP = new Set([
	"RIV",
	"BOC",
	"ARG",
	"VEL",
	"LAN",
	"NOB",
	"RAC",
	"IND",
	"EST",
	"ROS",
	"TAL",
	"SLO",
	"BAN",
]);
const clubesArgentinos: Record<string, number> = {};
for (const t of league.teams) {
	const nombre = `${t.region} ${t.name}`;
	clubesArgentinos[nombre] = CANTERAS_TOP.has(t.abbrev)
		? 6
		: t.disabled
			? 1
			: 3;
}
ar.colleges = clubesArgentinos;
ar.fractionSkipCollege = 0;

// Resto de Sudamérica: clubes principales. Peso según el tamaño del club.
const CLUBES: Record<string, Record<string, number>> = {
	Paraguay: {
		"Club Olimpia": 10,
		"Club Cerro Porteño": 10,
		"Club Libertad": 6,
		"Club Guaraní": 4,
		"Club Nacional": 3,
		"Club Sol de América": 2,
	},
	Colombia: {
		"Atlético Nacional": 10,
		Millonarios: 8,
		"América de Cali": 8,
		"Deportivo Cali": 6,
		Junior: 6,
		"Independiente Santa Fe": 5,
		"Independiente Medellín": 5,
		"Envigado Fútbol Club": 4,
		"Once Caldas": 3,
		"Deportes Tolima": 3,
		"Real Cartagena Fútbol Club": 1,
	},
	Chile: {
		"Colo-Colo": 10,
		"Universidad de Chile": 8,
		"Club Deportivo Universidad Católica": 8,
		"Club Deportivo Palestino": 3,
		"Audax Italiano": 2,
		Huachipato: 3,
	},
	Peru: {
		"Alianza Lima": 10,
		"Universitario de Deportes": 10,
		"Sporting Cristal": 8,
	},
	Ecuador: {
		"Independiente del Valle": 10,
		"Liga Deportiva Universitaria": 8,
		"Barcelona Sporting Club": 8,
		"Club Sport Emelec": 6,
	},
	Bolivia: {
		"Club Bolívar": 10,
		"The Strongest": 8,
	},
	Venezuela: {
		"Caracas Fútbol Club": 10,
		"Deportivo Táchira": 8,
	},
};
for (const [country, colleges] of Object.entries(CLUBES)) {
	bio.countries[country] = {
		...bio.countries[country],
		colleges,
		fractionSkipCollege: 0.15,
	};
}

// Países sin clubes cargados: sin club de formación, y nunca universidades de EE.UU.
for (const [country, info] of Object.entries(bio.countries) as [
	string,
	any,
][]) {
	if (!CLUBES[country] && country !== "Argentina" && country !== "Uruguay") {
		delete info.colleges;
		info.fractionSkipCollege = 1;
	}
}
bio.default = {
	...bio.default,
	colleges: {},
	fractionSkipCollege: 1,
};

writeFileSync(output, JSON.stringify(league));

console.log(
	`Argentina: nombres ${antesNombres} -> ${Object.keys(ar.first).length}, apellidos ${antesApellidos} -> ${Object.keys(ar.last).length}`,
);
console.log(
	`Ecuador: ${Object.keys(bio.countries.Ecuador.first).length} nombres, ${Object.keys(bio.countries.Ecuador.last).length} apellidos`,
);
console.log(
	`Clubes de formación: Argentina ${Object.keys(ar.colleges).length}, otros países ${Object.keys(CLUBES).length}`,
);
