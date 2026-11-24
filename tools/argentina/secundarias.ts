// Posiciones secundarias de Transfermarkt (captura "Composición de la
// plantilla según posiciones"). Uso:
//
//   node tools/argentina/secundarias.ts data/argentina/secundarias/TANDA.txt
//
// El archivo tiene un bloque por equipo:
//
//   # BOC
//   TOTAL POR 4/0 CEN 6/1 ... DEL ?/3     (fila "Total": principales/secundarias;
//                                          "?" si el botón de la página la tapa)
//   1|Álvaro Montero|POR|
//   2|Lautaro Di Lollo|CEN|LD
//   18|Walter Mazzantti=Walter Mazzanti|ED|ID DEL   (como figura en el plantel,
//                                                  si la captura lo escribe distinto)
//
// Controla cada bloque contra su fila de totales. Si el equipo está cargado
// (planteles/EQUIPO.json), escribe "secundarias" en cada jugador (avisa si el
// puesto o el número no coinciden, o si falta alguien); si no, lo guarda en
// secundarias-2026.json.

import { existsSync, readFileSync, writeFileSync } from "node:fs";

const AB: Record<string, string> = {
	POR: "Portero",
	LIB: "Líbero",
	CEN: "Defensa central",
	LI: "Lateral izquierdo",
	LD: "Lateral derecho",
	PIV: "Pivote",
	MC: "Mediocentro",
	ID: "Interior derecho",
	II: "Interior izquierdo",
	MCO: "Mediocentro ofensivo",
	EI: "Extremo izquierdo",
	ED: "Extremo derecho",
	MP: "Mediapunta",
	DEL: "Delantero centro",
};
const dir = new URL("../../data/argentina/", import.meta.url);
const norm = (s: string) =>
	s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

// Escribe un plantel con el formato de siempre (tabs), y deja en una línea
// los arreglos que ya estaban en una línea
const escribir = (ruta: URL, original: string, d: any) => {
	const enLinea = new Set(original.match(/"\w+": \[[^\[\]\n]*\]/g) ?? []);
	let t = JSON.stringify(d, null, "\t") + "\n";
	t = t.replace(/"(\w+)": \[\n(\t+)((?:"[^"\n]*",?\n\t+)+)\]/g, (m, k, _tab, cuerpo) => {
		const items = cuerpo.split("\n").map((x: string) => x.trim().replace(/,$/, "")).filter(Boolean);
		const corto = `"${k}": [${items.join(", ")}]`;
		return enLinea.has(corto) ? corto : m;
	});
	writeFileSync(ruta, t);
};

const archivo = process.argv[2];
if (!archivo) {
	throw new Error("Uso: node secundarias.ts TANDA.txt");
}
// Lo que está antes del primer "# " es una nota (fecha, de dónde salió)
const bloques = readFileSync(archivo, "utf8").split(/^# /m).slice(1).filter((b) => b.trim());
let errores = 0;
const sinCargar: Record<string, any[]> = {};
for (const b of bloques) {
	const [cab, ...lineas] = b.trim().split("\n").map((l) => l.trim()).filter(Boolean);
	const eq = cab!.split(/\s/)[0]!;
	const tot = lineas.find((l) => l.startsWith("TOTAL"));
	const filas = lineas
		.filter((l) => l.includes("|"))
		.map((l) => {
			const [n, nombres, p, s] = l.split("|").map((x) => x.trim());
			const [jugador, enPlantel] = nombres!.split("=").map((x) => x.trim());
			return { n: n === "-" ? null : n!, jugador: enPlantel ?? jugador!, p: p!, s: s ? s.split(/\s+/) : [] };
		});
	for (const f of filas) {
		for (const x of [f.p, ...f.s]) {
			if (x !== "?" && !AB[x]) {
				throw new Error(`${eq} ${f.jugador}: posición desconocida "${x}"`);
			}
		}
	}
	// Control contra la fila de totales
	const cuenta: Record<string, [number, number]> = {};
	for (const f of filas) {
		(cuenta[f.p] ??= [0, 0])[0]++;
		for (const s of f.s) {
			(cuenta[s] ??= [0, 0])[1]++;
		}
	}
	const avisos: string[] = [];
	for (const par of tot?.match(/[A-Z]+ [\d?]+\/[\d?]+/g) ?? []) {
		const [k, v] = par.split(" ") as [string, string];
		const [a, s] = v.split("/");
		const [x, y] = cuenta[k] ?? [0, 0];
		if ((a !== "?" && Number(a) !== x) || (s !== "?" && Number(s) !== y)) {
			avisos.push(`${k}: captura ${v}, transcripto ${x}/${y}`);
		}
	}
	if (!tot) {
		avisos.push("sin fila TOTAL");
	}
	const conSec = filas.filter((f) => f.s.length).length;
	console.log(`${eq}: ${filas.length} jugadores, ${conSec} con secundarias; totales ${avisos.length ? "DISTINTOS: " + avisos.join("; ") : "OK"}`);
	errores += avisos.length;

	const ruta = new URL(`planteles/${eq}.json`, dir);
	if (!existsSync(ruta)) {
		sinCargar[eq] = filas.map((f) => ({
			n: f.n,
			jugador: f.jugador,
			principal: f.p === "?" ? null : AB[f.p],
			secundarias: f.s.map((s) => AB[s]),
		}));
		continue;
	}
	const original = readFileSync(ruta, "utf8");
	const d = JSON.parse(original);
	const usados = new Set<any>();
	for (const f of filas) {
		const nombre = (j: any) => norm(`${j.nombre} ${j.apellido}`);
		let js = d.jugadores.filter((j: any) => nombre(j) === norm(f.jugador));
		if (js.length !== 1) {
			// Por número y apellido (nombre de pila o apellido compuesto distintos:
			// "Juan Pérez" = Juan José Pérez; "Matías Giménez" = Matías Giménez Rojas)
			const ap = norm(f.jugador).split(" ").at(-1)!;
			js = d.jugadores.filter((j: any) => j.n === f.n && nombre(j).split(" ").includes(ap));
		}
		if (js.length !== 1) {
			console.log(`  ${f.jugador}: no está en el plantel (${js.length} coincidencias)`);
			errores++;
			continue;
		}
		const j = js[0];
		usados.add(j);
		if (f.p !== "?" && j.pos !== AB[f.p]) {
			console.log(`  ${f.jugador}: puesto ${j.pos} en el plantel, ${AB[f.p]} en la captura`);
		}
		if (f.n !== null && j.n !== f.n) {
			console.log(`  ${f.jugador}: número ${j.n} en el plantel, ${f.n} en la captura`);
		}
		if (norm(`${j.nombre} ${j.apellido}`) !== norm(f.jugador)) {
			console.log(`  ${f.jugador}: en el plantel es ${j.nombre} ${j.apellido}`);
		}
		j.secundarias = f.s.map((s) => AB[s]);
	}
	for (const j of d.jugadores) {
		if (!usados.has(j)) {
			console.log(`  ${j.nombre} ${j.apellido}: está en el plantel y no en la captura`);
		}
	}
	escribir(ruta, original, d);
}
if (Object.keys(sinCargar).length) {
	const ruta = new URL("secundarias-2026.json", dir);
	const d = JSON.parse(readFileSync(ruta, "utf8"));
	Object.assign(d.equipos, sinCargar);
	writeFileSync(ruta, JSON.stringify(d, null, "\t") + "\n");
	console.log(`secundarias-2026.json: ${Object.keys(sinCargar).join(", ")}`);
}
if (errores) {
	console.log(`${errores} diferencias para revisar`);
}
