// Agrega como equipos inactivos a los clubes del ascenso 2026 (Primera
// Nacional, Federal A, Primera B Metropolitana y Primera C Metropolitana),
// elimina los inactivos que no juegan en esas categorías y crea la división
// Patagonia. Uso:
//
//   node tools/argentina/equipos-ascenso.ts ENTRADA.json SALIDA.json [equipos.csv]
//
// Los equipos nuevos se crean con el estilo del archivo: lugar + apodo en
// inglés. Apodos, colores, estadios y población de los equipos nuevos son
// PROVISORIOS: el CSV marca cuáles hay que revisar.

import { readFileSync, writeFileSync } from "node:fs";

const [input, output, csvOutput] = process.argv.slice(2);
if (!input || !output) {
	throw new Error(
		"Uso: node equipos-ascenso.ts ENTRADA.json SALIDA.json [equipos.csv]",
	);
}

const league = JSON.parse(readFileSync(input, "utf8"));
const ga = league.gameAttributes;

type Liga = "PN" | "TFA" | "PBM" | "PCM";

// División (nombre) -> zona (0 = Metropolitano, 1 = Federal)
const ZONA_DE_DIVISION: Record<string, number> = {
	"Capital Federal": 0,
	Conurbano: 0,
	"Buenos Aires": 1,
	Córdoba: 1,
	"Santa Fe": 1,
	Noroeste: 1,
	Mesopotamia: 1,
	Chaqueña: 1,
	Cuyo: 1,
	Patagonia: 1,
};

// Inactivos que ya existen en el archivo y juegan en el ascenso 2026
const EXISTENTES: Record<string, Liga> = {
	ALM: "PN",
	ALT: "PN",
	CHA: "PN",
	MOR: "PN",
	EBA: "PN",
	AND: "PN",
	QUI: "PN",
	TEM: "PN",
	ALL: "PN",
	ATL: "PN",
	NCH: "PN",
	FER: "PN",
	AGR: "PN",
	GOD: "PN",
	CNO: "PN",
	RAF: "PN",
	COL: "PN",
	GUE: "PN",
	MIT: "PN",
	CFE: "PN",
	CAR: "PN",
	PAT: "PN",
	GJU: "PN",
	SMSJ: "PN",
	SMT: "PN",
	OLI: "TFA",
	SAN: "TFA",
	CAS: "TFA",
	BUC: "TFA",
	JUV: "TFA",
	ARS: "PBM",
	ARM: "PBM",
	CADU: "PBM",
	COM: "PBM",
	CDE: "PCM",
};

// Cambios de división de equipos existentes, según la jurisdicción 2026
const CAMBIOS_DIVISION: Record<string, string> = {
	ALM: "Conurbano",
	CHA: "Conurbano",
	CADU: "Buenos Aires",
};

// Inactivos que no juegan en ninguna de las cuatro categorías: se eliminan
const ELIMINAR = ["HTA", "TFA", "DES", "ATC", "HCO", "CDM", "GAF"];

// Equipos nuevos: [abreviatura, club, lugar, apodo, división, liga, colores]
// colores = null: no los conozco con seguridad, quedan grises para revisar
type Nuevo = [string, string, string, string, string, Liga, string[] | null];

const CELESTE = ["#6cace4", "#ffffff", "#ffffff"];
const ROJO = ["#d50000", "#ffffff", "#ffffff"];
const VERDE = ["#1b7a3e", "#ffffff", "#ffffff"];

const NUEVOS: Nuevo[] = [
	// Primera Nacional
	["ACA", "Acassuso", "Boulogne", "Burners", "Conurbano", "PN", CELESTE],
	["CGL", "Colegiales", "Munro", "Tricolors", "Conurbano", "PN", null],
	[
		"MID",
		"Ferrocarril Midland",
		"Libertad",
		"Gravediggers",
		"Conurbano",
		"PN",
		null,
	],
	[
		"SMI",
		"San Miguel",
		"San Miguel",
		"Green Thunder",
		"Conurbano",
		"PN",
		VERDE,
	],
	[
		"STL",
		"San Telmo",
		"Isla Maciel",
		"Candomberos",
		"Conurbano",
		"PN",
		CELESTE,
	],
	[
		"TSU",
		"Tristán Suárez",
		"Tristán Suárez",
		"Milkmen",
		"Conurbano",
		"PN",
		null,
	],
	[
		"DBE",
		"Defensores de Belgrano",
		"Núñez",
		"Dragons",
		"Capital Federal",
		"PN",
		["#d50000", "#000000", "#ffffff"],
	],
	[
		"BOL",
		"Ciudad de Bolívar",
		"Bolívar",
		"Citizens",
		"Buenos Aires",
		"PN",
		null,
	],
	["MAI", "Deportivo Maipú", "Maipú", "Crusaders", "Cuyo", "PN", null],
	[
		"GYT",
		"Gimnasia y Tiro",
		"Salta",
		"Whites",
		"Noroeste",
		"PN",
		["#ffffff", "#6cace4", "#6cace4"],
	],
	[
		"MAD",
		"Deportivo Madryn",
		"Puerto Madryn",
		"Golden Blacks",
		"Patagonia",
		"PN",
		["#000000", "#f5c518", "#f5c518"],
	],

	// Federal A
	[
		"ALV",
		"Alvarado",
		"Mar del Plata",
		"Little Bulls",
		"Buenos Aires",
		"TFA",
		["#0033a0", "#ffffff", "#ffffff"],
	],
	[
		"ESC",
		"Atlético Escobar",
		"Escobar",
		"Athletic",
		"Buenos Aires",
		"TFA",
		null,
	],
	[
		"CDO",
		"Círculo Deportivo",
		"Nicanor Otamendi",
		"Circle",
		"Buenos Aires",
		"TFA",
		null,
	],
	[
		"DBV",
		"Defensores de Belgrano (VR)",
		"Villa Ramallo",
		"Defenders",
		"Buenos Aires",
		"TFA",
		null,
	],
	[
		"DOU",
		"Douglas Haig",
		"Pergamino",
		"Stokers",
		"Buenos Aires",
		"TFA",
		["#d50000", "#000000", "#ffffff"],
	],
	["LIN", "El Linqueño", "Lincoln", "Lincolnites", "Buenos Aires", "TFA", null],
	[
		"GCH",
		"Gimnasia y Esgrima (Chivilcoy)",
		"Chivilcoy",
		"Wolves",
		"Buenos Aires",
		"TFA",
		null,
	],
	[
		"ICH",
		"Independiente (Chivilcoy)",
		"Chivilcoy",
		"Reds",
		"Buenos Aires",
		"TFA",
		ROJO,
	],
	["KIM", "Kimberley", "Mar del Plata", "Dragons", "Buenos Aires", "TFA", null],
	[
		"VMI",
		"Villa Mitre",
		"Bahía Blanca",
		"Tricolors",
		"Buenos Aires",
		"TFA",
		null,
	],
	[
		"AMM",
		"Argentino (Monte Maíz)",
		"Monte Maíz",
		"Argentines",
		"Córdoba",
		"TFA",
		null,
	],
	[
		"ATE",
		"Atenas (Río Cuarto)",
		"Río Cuarto",
		"Athenians",
		"Córdoba",
		"TFA",
		null,
	],
	[
		"SBE",
		"Sportivo Belgrano (San Francisco)",
		"San Francisco",
		"Greens",
		"Córdoba",
		"TFA",
		VERDE,
	],
	["FAD", "FADEP", "Mendoza", "Sportsmen", "Cuyo", "TFA", null],
	["HLH", "Huracán Las Heras", "Las Heras", "Balloons", "Cuyo", "TFA", ROJO],
	["SMM", "San Martín (Mendoza)", "San Martín", "Saints", "Cuyo", "TFA", null],
	[
		"VIL",
		"Defensores de Vilelas",
		"Puerto Vilelas",
		"Defenders",
		"Chaqueña",
		"TFA",
		null,
	],
	["NDJ", "9 de Julio (Rafaela)", "Rafaela", "Lions", "Santa Fe", "TFA", null],
	[
		"SLP",
		"Sportivo Las Parejas",
		"Las Parejas",
		"Sportsmen",
		"Santa Fe",
		"TFA",
		null,
	],
	["GER", "Germinal", "Rawson", "Germinals", "Patagonia", "TFA", null],
	[
		"GBR",
		"Guillermo Brown",
		"Puerto Madryn",
		"Browns",
		"Patagonia",
		"TFA",
		null,
	],
	["SMF", "San Martín (Formosa)", "Formosa", "Saints", "Chaqueña", "TFA", null],
	[
		"SDA",
		"Sol de América (Formosa)",
		"Formosa",
		"Suns",
		"Chaqueña",
		"TFA",
		null,
	],
	[
		"CIP",
		"Cipolletti",
		"Cipolletti",
		"Black and Whites",
		"Patagonia",
		"TFA",
		["#ffffff", "#000000", "#000000"],
	],
	["SDM", "Sol de Mayo", "Viedma", "Suns", "Patagonia", "TFA", null],
	[
		"GCU",
		"Gimnasia y Esgrima (Concepción del Uruguay)",
		"Concepción del Uruguay",
		"Wolves",
		"Mesopotamia",
		"TFA",
		null,
	],
	["CBR", "Costa Brava", "General Pico", "Coasters", "Patagonia", "TFA", null],
	[
		"BMI",
		"Bartolomé Mitre (Posadas)",
		"Posadas",
		"Mitres",
		"Mesopotamia",
		"TFA",
		null,
	],
	[
		"RIN",
		"Deportivo Rincón",
		"Rincón de los Sauces",
		"Willows",
		"Patagonia",
		"TFA",
		null,
	],
	[
		"JUU",
		"Juventud Unida Universitario",
		"San Luis",
		"Scholars",
		"Cuyo",
		"TFA",
		null,
	],
	[
		"SLB",
		"Sarmiento (La Banda)",
		"La Banda",
		"Sarmientos",
		"Chaqueña",
		"TFA",
		null,
	],
	["TCE", "Tucumán Central", "Tucumán", "Centrals", "Noroeste", "TFA", null],

	// Primera B Metropolitana
	["AME", "Argentino de Merlo", "Merlo", "Frogs", "Conurbano", "PBM", null],
	[
		"AQU",
		"Argentino de Quilmes",
		"Quilmes",
		"Mates",
		"Conurbano",
		"PBM",
		CELESTE,
	],
	["BAD", "Brown de Adrogué", "Adrogué", "Tricolors", "Conurbano", "PBM", null],
	[
		"CMN",
		"Deportivo Camioneros",
		"Esteban Echeverría",
		"Truckers",
		"Conurbano",
		"PBM",
		null,
	],
	[
		"LAF",
		"Deportivo Laferrere",
		"Laferrere",
		"Gypsies",
		"Conurbano",
		"PBM",
		VERDE,
	],
	["DME", "Deportivo Merlo", "Merlo", "Charros", "Conurbano", "PBM", CELESTE],
	["DOC", "Dock Sud", "Dock Sud", "Dockers", "Conurbano", "PBM", null],
	["ITU", "Ituzaingó", "Ituzaingó", "Lions", "Conurbano", "PBM", null],
	["LNR", "Liniers", "San Justo", "Moles", "Conurbano", "PBM", null],
	[
		"SMB",
		"San Martín (Burzaco)",
		"Burzaco",
		"Saints",
		"Conurbano",
		"PBM",
		null,
	],
	[
		"SIT",
		"Sportivo Italiano",
		"Ciudad Evita",
		"Italians",
		"Conurbano",
		"PBM",
		null,
	],
	[
		"TRE",
		"Talleres (Remedios de Escalada)",
		"Remedios de Escalada",
		"Mechanics",
		"Conurbano",
		"PBM",
		ROJO,
	],
	["UAI", "UAI Urquiza", "Villa Lynch", "Fury", "Conurbano", "PBM", null],
	[
		"FLA",
		"Flandria",
		"Jáuregui",
		"Canaries",
		"Buenos Aires",
		"PBM",
		["#1b7a3e", "#f5c518", "#f5c518"],
	],
	["RPI", "Real Pilar", "Pilar", "Monarchs", "Buenos Aires", "PBM", null],
	[
		"VDA",
		"Villa Dálmine",
		"Campana",
		"Violets",
		"Buenos Aires",
		"PBM",
		["#6a0dad", "#ffffff", "#ffffff"],
	],
	[
		"EXC",
		"Excursionistas",
		"Belgrano",
		"Excursionists",
		"Capital Federal",
		"PBM",
		VERDE,
	],
	[
		"VSC",
		"Villa San Carlos",
		"Berisso",
		"Sky Blues",
		"Buenos Aires",
		"PBM",
		CELESTE,
	],

	// Primera C Metropolitana
	[
		"BZT",
		"Berazategui",
		"Berazategui",
		"Oranges",
		"Conurbano",
		"PCM",
		["#ff7f00", "#1b7a3e", "#ffffff"],
	],
	[
		"CBL",
		"Central Ballester",
		"Villa Ballester",
		"Centrals",
		"Conurbano",
		"PCM",
		null,
	],
	[
		"CES",
		"Centro Español",
		"El Palomar",
		"Spaniards",
		"Conurbano",
		"PCM",
		null,
	],
	["CLA", "Claypole", "Claypole", "Dairymen", "Conurbano", "PCM", null],
	[
		"DPA",
		"Deportivo Paraguayo",
		"Villa Celina",
		"Guaranis",
		"Conurbano",
		"PCM",
		["#d50000", "#ffffff", "#0038a8"],
	],
	["EPO", "El Porvenir", "Gerli", "Futures", "Conurbano", "PCM", null],
	[
		"JJU",
		"J. J. de Urquiza",
		"Loma Hermosa",
		"Generals",
		"Conurbano",
		"PCM",
		null,
	],
	["JUN", "Juventud Unida", "San Miguel", "Youth", "Conurbano", "PCM", null],
	["LUG", "Lugano", "Tapiales", "Luganese", "Conurbano", "PCM", null],
	["MUN", "Muñiz", "Muñiz", "Villagers", "Conurbano", "PCM", null],
	[
		"VAR",
		"Victoriano Arenas",
		"Valentín Alsina",
		"Victorians",
		"Conurbano",
		"PCM",
		null,
	],
	["YUP", "Yupanqui", "Villa Lugano", "Ragmen", "Conurbano", "PCM", null],
	["ATS", "Atlas", "General Rodríguez", "Browns", "Buenos Aires", "PCM", null],
	["CNU", "Cañuelas", "Cañuelas", "Dairy Farmers", "Buenos Aires", "PCM", null],
	[
		"EDS",
		"Estrella del Sur",
		"Estrella del Sur",
		"Stars",
		"Buenos Aires",
		"PCM",
		null,
	],
	[
		"LNA",
		"Leandro N. Alem",
		"General Rodríguez",
		"Alemites",
		"Buenos Aires",
		"PCM",
		null,
	],
	["LUJ", "Luján", "Luján", "Pilgrims", "Buenos Aires", "PCM", null],
	["MER", "Mercedes", "Mercedes", "Mercedinos", "Buenos Aires", "PCM", null],
	["PNU", "Puerto Nuevo", "Campana", "Harbor", "Buenos Aires", "PCM", null],
	["FEN", "Fénix", "Villa Ortúzar", "Phoenix", "Capital Federal", "PCM", null],
	[
		"LAM",
		"General Lamadrid",
		"Villa Devoto",
		"Jailers",
		"Capital Federal",
		"PCM",
		null,
	],
	[
		"SAC",
		"Sacachispas",
		"Villa Soldati",
		"Lilacs",
		"Capital Federal",
		"PCM",
		["#9b59b6", "#ffffff", "#ffffff"],
	],
	[
		"SBA",
		"Sportivo Barracas",
		"Barracas",
		"Sportsmen",
		"Capital Federal",
		"PCM",
		null,
	],
	[
		"ARO",
		"Argentino (Rosario)",
		"Rosario",
		"Argentines",
		"Santa Fe",
		"PCM",
		null,
	],
	[
		"CCR",
		"Central Córdoba (Rosario)",
		"Rosario",
		"Charrúas",
		"Santa Fe",
		"PCM",
		null,
	],
	["LEO", "Leones", "Rosario", "Lions", "Santa Fe", "PCM", null],
	[
		"DCA",
		"Defensores de Cambaceres",
		"Ensenada",
		"Reds",
		"Buenos Aires",
		"PCM",
		ROJO,
	],
];

// Valores provisorios por categoría y región
const ESTADIO: Record<Liga, number> = {
	PN: 15000,
	TFA: 10000,
	PBM: 6000,
	PCM: 3000,
};
const POBLACION = (division: string) =>
	division === "Capital Federal"
		? 3.120612
		: division === "Conurbano"
			? 0.3
			: 0.15;

// ---------------------------------------------------------------------------

// División Patagonia
const divsEntry = Array.isArray(ga.divs[0]?.value) ? ga.divs.at(-1) : undefined;
const divs: any[] = divsEntry ? divsEntry.value : ga.divs;
if (!divs.some((d) => d.name === "Patagonia")) {
	const did = Math.max(...divs.map((d) => d.did)) + 1;
	divs.push({ did, cid: 1, name: "Patagonia" });
	console.log(`División agregada: Patagonia (did ${did}, Federal)`);
}
const didOf = (name: string) => {
	const div = divs.find((d) => d.name === name);
	if (!div) {
		throw new Error(`No existe la división ${name}`);
	}
	return div.did;
};

const teamByAbbrev = (abbrev: string) =>
	league.teams.find((t: any) => t.abbrev === abbrev);

// Eliminar: sus lugares se reutilizan para equipos nuevos
const libres: number[] = [];
for (const abbrev of ELIMINAR) {
	const t = teamByAbbrev(abbrev);
	if (!t) {
		continue;
	}
	if (!t.disabled) {
		throw new Error(`${abbrev} está activo, no se puede eliminar`);
	}
	libres.push(t.tid);
	league.teams = league.teams.filter((t2: any) => t2 !== t);
	console.log(`Eliminado: ${abbrev} ${t.region} ${t.name} (tid ${t.tid})`);
}
// Referencias de jugadores a equipos eliminados (los planteles se rehacen
// igual, pero así nadie queda apuntando a un club que cambió)
const libresSet = new Set(libres);
for (const p of league.players) {
	if (p.draft && libresSet.has(p.draft.tid)) {
		p.draft.tid = -1;
	}
	if (p.draft && libresSet.has(p.draft.originalTid)) {
		p.draft.originalTid = -1;
	}
	if (Array.isArray(p.statsTids)) {
		p.statsTids = p.statsTids.filter((tid: number) => !libresSet.has(tid));
	}
	if (Array.isArray(p.stats)) {
		p.stats = p.stats.filter((s: any) => !libresSet.has(s.tid));
	}
}

// Cambios de división
for (const [abbrev, division] of Object.entries(CAMBIOS_DIVISION)) {
	const t = teamByAbbrev(abbrev);
	t.did = didOf(division);
	t.cid = ZONA_DE_DIVISION[division];
	for (const s of t.seasons ?? []) {
		s.did = t.did;
		s.cid = t.cid;
	}
	console.log(`División cambiada: ${abbrev} -> ${division}`);
}

// Base para los equipos nuevos: un inactivo existente
const base = structuredClone(teamByAbbrev("FER"));
let nextTid = Math.max(...league.teams.map((t: any) => t.tid), ...libres) + 1;
for (const [abbrev, , region, name, division] of NUEVOS) {
	if (teamByAbbrev(abbrev)) {
		throw new Error(`La abreviatura ${abbrev} ya existe`);
	}
	const liga = NUEVOS.find((n) => n[0] === abbrev)![5];
	const colors = NUEVOS.find((n) => n[0] === abbrev)![6] ?? [
		"#808080",
		"#ffffff",
		"#000000",
	];
	const tid = libres.length > 0 ? libres.shift()! : nextTid++;
	league.teams.push({
		...structuredClone(base),
		tid,
		cid: ZONA_DE_DIVISION[division],
		did: didOf(division),
		region,
		name,
		abbrev,
		imgURL: "",
		imgURLSmall: "",
		colors,
		pop: POBLACION(division),
		stadiumCapacity: ESTADIO[liga],
		retiredJerseyNumbers: [],
		disabled: true,
		seasons: [],
		stats: [],
	});
}
league.teams.sort((a: any, b: any) => a.tid - b.tid);
league.teams.forEach((t: any, i: number) => {
	if (t.tid !== i) {
		throw new Error(
			`Los tid no son correlativos: posición ${i} tiene tid ${t.tid}`,
		);
	}
});

console.log(
	`Equipos: ${league.teams.length} (${league.teams.filter((t: any) => !t.disabled).length} activos), ${NUEVOS.length} nuevos`,
);

writeFileSync(output, JSON.stringify(league));

// CSV para revisar
if (csvOutput) {
	const divName = Object.fromEntries(divs.map((d) => [d.did, d.name]));
	const nuevos = new Map(NUEVOS.map((n) => [n[0], n]));
	const liga = (t: any) =>
		!t.disabled
			? "LPF"
			: (EXISTENTES[t.abbrev] ?? nuevos.get(t.abbrev)?.[5] ?? "?");
	const rows = [
		"tid,abreviatura,club,lugar,apodo,zona,division,categoria,activo,colores,estadio,poblacion,revisar",
	];
	const q = (v: unknown) => `"${String(v).replaceAll('"', '""')}"`;
	for (const t of league.teams) {
		const nuevo = nuevos.get(t.abbrev);
		const revisar = nuevo
			? `apodo, estadio y población provisorios${nuevo[6] ? "" : "; colores desconocidos"}`
			: "";
		rows.push(
			[
				t.tid,
				t.abbrev,
				nuevo?.[1] ?? "",
				t.region,
				t.name,
				t.cid === 0 ? "Metropolitano" : "Federal",
				divName[t.did],
				liga(t),
				t.disabled ? "no" : "sí",
				t.colors.join(" "),
				t.stadiumCapacity,
				t.pop,
				revisar,
			]
				.map(q)
				.join(","),
		);
	}
	writeFileSync(csvOutput, rows.join("\n") + "\n");
	console.log(`CSV: ${csvOutput}`);
}
