// Escalera de vecinos: para cada jugador de los equipos pedidos, los de su
// mismo grupo de puestos con OVR a ±1 en otros equipos cargados, con sus
// números (PJ, minutos, goles, asistencias, entradas desde el banco,
// Sofascore, valor, puesto del equipo en la tabla anual). Sirve para
// justificar cada OVR (segunda revisión, v2.20.1). Uso:
//
//   node tools/argentina/vecinos.ts ARCHIVO.json EQUIPO [EQUIPO ...]


import { readFileSync, readdirSync } from "node:fs";
const [archivo, ...equipos] = process.argv.slice(2);
const L = JSON.parse(readFileSync(archivo));
const T = Object.fromEntries(L.teams.map((t) => [t.tid, t.abbrev]));
const dir = new URL("../../data/argentina/planteles/", import.meta.url).pathname;
const datos = new Map();
for (const f of readdirSync(dir).filter((x) => x.endsWith(".json"))) {
	const p = JSON.parse(readFileSync(dir + f));
	for (const j of p.jugadores) datos.set(`${p.equipo}|${j.nombre} ${j.apellido}`.trim(), j);
}
const anual = Object.fromEntries(JSON.parse(readFileSync(new URL("../../data/argentina/tablas-2026.json", import.meta.url))).anual.map((r) => [r.equipo, r.pos]));
const G = { C: "ARQ", FC: "CEN", PF: "CEN", GF: "LAT", G: "MED", SG: "MED", PG: "OFE", SF: "OFE", F: "DEL" };
const filas = [];
for (const p of L.players) {
	if (p.tid < 0) continue;
	const eq = T[p.tid];
	const j = datos.get(`${eq}|${p.firstName} ${p.lastName}`.trim());
	if (!j) continue;
	const r = p.ratings.at(-1);
	filas.push({ eq, nom: `${p.firstName ? p.firstName[0] + ". " : ""}${p.lastName}`, g: G[r.pos], ovr: r.ovr, j, edad: 2026 - p.born.year });
}
const desc = (x) => `${x.ovr} ${x.nom} ${x.eq}(${anual[x.eq]}º) ${x.edad}a ${x.j.pj}PJ ${x.j.min}' ${x.j.goles}g${x.j.asist !== undefined ? ` ${x.j.asist}a` : ""}${x.j.entro !== undefined ? ` e${x.j.entro}` : ""}${x.j.sofascore ? ` S${x.j.sofascore}` : ""} ${((x.j.valor ?? 0) / 1e6).toFixed(1)}M${x.j.fichado && +x.j.fichado.slice(3, 5) >= 7 && x.j.fichado.endsWith("2026") ? " (desde " + x.j.fichado.slice(3) + ")" : ""}`;
for (const eq of equipos) {
	console.log(`\n===== ${eq}`);
	for (const x of filas.filter((x) => x.eq === eq).sort((a, b) => a.g.localeCompare(b.g) || b.ovr - a.ovr)) {
		const v = filas.filter((y) => y !== x && y.g === x.g && Math.abs(y.ovr - x.ovr) <= 1 && !equipos.includes(y.eq)).sort((a, b) => b.ovr - a.ovr).slice(0, 6);
		console.log(`${x.g} >> ${desc(x)}\n      ${v.map(desc).join(" | ")}`);
	}
}
