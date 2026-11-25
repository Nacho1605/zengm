// Segunda revisión: cada jugador de los equipos pedidos contra los de su grupo
// de puestos con minutos parecidos en el año (±25%, con las salidas sumadas) en
// los demás equipos cargados: mediana y rango de sus OVR; marca con <<< a los
// que se apartan 3 o más. Al final, el desvío medio del equipo (jugadores con
// 600 minutos o más), para comparar equipos. Uso:
//
//   node tools/argentina/pares-minutos.mjs ARCHIVO.json EQUIPO [EQUIPO ...]
//   RESUMEN=1 node tools/argentina/pares-minutos.mjs ARCHIVO.json EQUIPO   # solo el desvío
import { readFileSync, readdirSync } from "node:fs";
const [archivo, ...equipos] = process.argv.slice(2);
const L = JSON.parse(readFileSync(archivo, "utf8"));
const T = Object.fromEntries(L.teams.map((t) => [t.tid, t.abbrev]));
const dir = new URL("../../data/argentina/", import.meta.url).pathname;
const norm = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const datos = new Map();
for (const f of readdirSync(dir + "planteles").filter((x) => x.endsWith(".json"))) {
	const p = JSON.parse(readFileSync(dir + "planteles/" + f));
	for (const j of p.jugadores) datos.set(`${p.equipo}|${j.nombre} ${j.apellido}`.trim(), j);
}
const sal = JSON.parse(readFileSync(dir + "salidas-2026.json")).jugadores;
const G = { C: "ARQ", FC: "CEN", PF: "CEN", GF: "LAT", G: "MED", SG: "MED", PG: "OFE", SF: "OFE", F: "DEL" };
const rows = [];
for (const p of L.players) {
	if (p.tid < 0) continue;
	const eq = T[p.tid];
	const j = datos.get(`${eq}|${p.firstName} ${p.lastName}`.trim());
	if (!j) continue;
	const edad = 2026 - p.born.year;
	const otros = sal.filter((s) => s.club !== eq && norm(`${s.nombre} ${s.apellido}`) === norm(`${j.nombre} ${j.apellido}`) && Math.abs((s.edad ?? edad) - edad) <= 1 && !(j.apellido === "Sosa" && eq === "DYJ"));
	const suma = (k) => (j[k] ?? 0) + otros.reduce((a, s) => a + (s[k] ?? 0), 0);
	rows.push({ eq, n: `${j.nombre[0]}. ${j.apellido}`, g: G[p.ratings.at(-1).pos], ovr: p.ratings.at(-1).ovr, min: suma("min"), ga: suma("goles") + suma("asist"), ss: j.sofascore, val: j.valor ?? 0, edad });
}
const resumen = {};
for (const r of rows.filter((r) => equipos.includes(r.eq))) {
	const pares = rows.filter((x) => x !== r && !equipos.includes(x.eq) && x.g === r.g && Math.abs(x.min - r.min) <= Math.max(150, r.min * 0.25));
	const o = pares.map((x) => x.ovr).sort((a, b) => a - b);
	const med = o.length ? o[Math.floor(o.length / 2)] : null;
	const d = med == null ? "" : r.ovr - med;
	if (med != null && r.min >= 600) (resumen[r.eq] ??= []).push(r.ovr - med);
	if (!process.env.RESUMEN) console.log(`${r.eq} ${r.g} ${String(r.ovr).padStart(2)} ${r.n.padEnd(16)} ${String(r.min).padStart(4)}' GA${r.ga} ${r.ss ?? ""} ${(r.val / 1e6).toFixed(2)}M ${r.edad}a | pares ${o.length}, mediana ${med}, rango ${o[0]}-${o.at(-1)}  ${Math.abs(d) >= 3 ? "<<< " + (d > 0 ? "+" : "") + d : ""}`);
}
for (const [e, d] of Object.entries(resumen)) console.log(e, "desvío medio (≥600\x27):", (d.reduce((a, b) => a + b, 0) / d.length).toFixed(1), "en", d.length);
