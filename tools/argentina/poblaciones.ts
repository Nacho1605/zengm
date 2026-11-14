// Carga la población de cada club según su ciudad o barrio (campo "region").
// Uso:
//
//   node tools/argentina/poblaciones.ts ENTRADA.json SALIDA.json
//
// Valores en millones de habitantes, por partido o departamento (datos
// provistos por el usuario).

import { readFileSync, writeFileSync } from "node:fs";

const [input, output] = process.argv.slice(2);
if (!input || !output) {
	throw new Error("Uso: node poblaciones.ts ENTRADA.json SALIDA.json");
}

const GRUPOS: [string[], number][] = [
	// Ciudad de Buenos Aires
	[
		[
			"Agronomía",
			"Bajo Belgrano",
			"Bajo Flores",
			"Barracas",
			"Belgrano",
			"Boedo",
			"Caballito",
			"Floresta",
			"La Boca",
			"La Paternal",
			"La Quema",
			"Liniers",
			"Mataderos",
			"Núñez",
			"Pompeya",
			"Villa Crespo",
			"Villa Devoto",
			"Villa Lugano",
			"Villa Soldati",
		],
		3.119304,
	],
	// Conurbano
	[["Avellaneda", "Dock Sud", "Sarandí", "Gerli", "San Telmo"], 0.367554],
	[["Lanús", "Alsina", "Escalada"], 0.461209],
	[["Banfield", "Lomas", "Temperley"], 0.690167],
	[["Adrogué", "Burzaco", "Claypole"], 0.584827],
	[["Quilmes"], 0.633348],
	[["Berazategui"], 0.358712],
	[["Varela"], 0.49643],
	[["Echeverría"], 0.338477],
	[["Ezeiza"], 0.201511],
	[
		[
			"Casanova",
			"Ciudad Evita",
			"Laferrere",
			"Tapiales",
			"Villa Celina",
			"Villegas",
		],
		1.840868,
	],
	[["Morón", "Haedo"], 0.33114],
	[["Ituzaingó"], 0.180232],
	[["Merlo", "Libertad"], 0.582464],
	[["Caseros", "Loma Hermosa", "Almagro"], 0.36414],
	[["Villa Ballester", "Villa Lynch", "Chacarita"], 0.450537],
	[["Florida", "Munro"], 0.282243],
	[["Acassuso"], 0.29727],
	[["Victoria"], 0.17159],
	[["San Miguel", "Muñiz"], 0.328776],
	[["Escobar", "Maschwitz"], 0.256266],
	// Resto de la provincia de Buenos Aires
	[["Pilar"], 0.394754],
	[["Campana"], 0.110566],
	[["Zárate"], 0.132216],
	[["Luján", "Jáuregui"], 0.111008],
	[["General Rodríguez"], 0.142646],
	[["Marcos Paz"], 0.067011],
	[["Mercedes"], 0.07297],
	[["Cañuelas"], 0.070684],
	[["Alejandro Korn"], 0.098215],
	[["La Plata"], 0.768403],
	[["Berisso"], 0.10093],
	[["Ensenada"], 0.063997],
	[["Junín"], 0.103787],
	[["Mar del Plata"], 0.666844],
	[["Otamendi"], 0.045526],
	[["Bahía Blanca"], 0.336571],
	[["Bolívar"], 0.037592],
	[["Casares"], 0.0231],
	[["Chivilcoy"], 0.070839],
	[["Lincoln"], 0.045506],
	[["Pergamino"], 0.11534],
	[["Tandil"], 0.145573],
	[["Villa Ramallo"], 0.03973],
	// Córdoba
	[["Córdoba"], 1.50515],
	[["Río Cuarto"], 0.279897],
	[["Monte Maíz"], 0.114571],
	[["San Francisco"], 0.230335],
	// Santa Fe
	[["Rosario"], 1.348452],
	[["Santa Fe"], 0.572155],
	[["Rafaela"], 0.190564],
	[["Las Parejas"], 0.048779],
	// Cuyo
	[["Mendoza"], 0.195156],
	[["Maipú"], 0.219402],
	[["Las Heras"], 0.234342],
	[["San Martín"], 0.139792],
	[["San Juan"], 0.11534],
	[["San Luis"], 0.261693],
	// Noroeste
	[["Tucumán"], 0.59026],
	[["Salta"], 0.627477],
	[["Jujuy"], 0.320908],
	// Chaqueña
	[["Santiago"], 0.330084],
	[["La Banda"], 0.170624],
	[["Resistencia", "Puerto Vilelas"], 0.416113],
	[["Formosa"], 0.269589],
	// Mesopotamia
	[["Corrientes"], 0.439226],
	[["Posadas"], 0.392861],
	[["Paraná"], 0.391626],
	[["Concepción"], 0.116343],
	// Patagonia
	[["Madryn"], 0.103129],
	[["Rawson"], 0.145763],
	[["Cipolletti"], 0.380521],
	[["Viedma"], 0.064482],
	[["Pico"], 0.069514],
	[["Rincón"], 0.029753],
];

const POBLACION = new Map<string, number>();
for (const [regions, pop] of GRUPOS) {
	for (const region of regions) {
		if (POBLACION.has(region)) {
			throw new Error(`${region} aparece dos veces`);
		}
		POBLACION.set(region, pop);
	}
}

const league = JSON.parse(readFileSync(input, "utf8"));
const missing: string[] = [];
for (const t of league.teams) {
	const pop = POBLACION.get(t.region);
	if (pop === undefined) {
		missing.push(`${t.abbrev} (${t.region})`);
		continue;
	}
	t.pop = pop;
	for (const s of t.seasons ?? []) {
		s.pop = pop;
	}
}

if (missing.length > 0) {
	throw new Error(`Sin población: ${missing.join(", ")}`);
}
const unused = [...POBLACION.keys()].filter(
	(region) => !league.teams.some((t: any) => t.region === region),
);
console.log(
	`Población cargada en ${league.teams.length} equipos${unused.length > 0 ? ` | sin usar: ${unused.join(", ")}` : ""}`,
);

writeFileSync(output, JSON.stringify(league));
