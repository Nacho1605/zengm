// Composites del motor por puesto y su cruce con la realidad 2026 (análisis
// del 24/11, ver data/argentina/analisis-composites-y-capitanes.md). Uso:
//
//   node tools/argentina/composites.mjs ARCHIVO.json

import { readFileSync, readdirSync } from "node:fs";
const src = readFileSync("/home/user/zengm/src/common/constants.basketball.ts", "utf8");
const blk = src.slice(src.indexOf("export const COMPOSITE_WEIGHTS"), src.indexOf("export const PLAYER_GAME_STATS"));
const CW = {};
for (const m of blk.matchAll(/\n\t(\w+): \{\n\t\tratings: \[([^\]]*)\],(?:\n\t\tweights: \[([^\]]*)\])?/g)) {
	CW[m[1]] = { r: m[2].split(",").map((s) => s.trim()).filter(Boolean).map((s) => (s.startsWith('"') ? s.slice(1, -1) : Number(s))), w: m[3] ? m[3].split(",").map(Number) : null };
}
const comp = (r, c) => { let n = 0, d = 0; c.r.forEach((k, i) => { const w = c.w?.[i] ?? 1; n += (typeof k === "number" ? k : r[k]) * w; d += 100 * w; }); return Math.max(0, Math.min(1, n / d)); };
const L = JSON.parse(readFileSync(process.argv[2], "utf8"));
const loaded = new Set(readdirSync("/home/user/zengm/data/argentina/planteles").filter((f) => f.endsWith(".json")).map((f) => f.slice(0, 3)));
const tids = new Set(L.teams.filter((t) => loaded.has(t.abbrev)).map((t) => t.tid));
const P = L.players.filter((p) => tids.has(p.tid) && p.ratings.at(-1).ovr >= 55);
const POS = ["C", "FC", "PF", "GF", "G", "SG", "PG", "SF", "F"];
const NOM = { C: "Arquero", FC: "Central #2", PF: "Central #6", GF: "Lateral", G: "Pivote", SG: "Volante", PG: "Mediapunta", SF: "Extremo", F: "Delantero" };
const keys = Object.keys(CW).filter((k) => k !== "jumpBall");
console.log("Promedio de cada composite por puesto (OVR 55 o más; 0-100):");
console.log("composite".padEnd(22) + POS.map((p) => p.padStart(5)).join(""));
const prom = {};
for (const k of keys) {
	prom[k] = {};
	for (const p of POS) { const xs = P.filter((x) => x.ratings.at(-1).pos === p).map((x) => comp(x.ratings.at(-1), CW[k])); prom[k][p] = xs.reduce((a, b) => a + b, 0) / xs.length * 100; }
	console.log(k.padEnd(22) + POS.map((p) => prom[k][p].toFixed(0).padStart(5)).join(""));
}
console.log("n por puesto:", POS.map((p) => p + " " + P.filter((x) => x.ratings.at(-1).pos === p).length).join(", "));
// Habilidades (letras) por puesto
const SK = { usage: [0.61, "V"], dribbling: [0.68, "B"], passing: [0.63, "Ps"], shootingLowPost: [0.61, "Po"], shootingThreePointer: [0.59, "3"], rebounding: [0.61, "R"], defenseInterior: [0.57, "Di"], defensePerimeter: [0.61, "Dp"], athleticism: [0.63, "A"] };
console.log("\n% con cada habilidad (letra del juego) por puesto:");
console.log("habilidad".padEnd(10) + POS.map((p) => p.padStart(5)).join(""));
for (const [k, [cut, lab]] of Object.entries(SK)) console.log(lab.padEnd(10) + POS.map((p) => { const xs = P.filter((x) => x.ratings.at(-1).pos === p); return (xs.filter((x) => comp(x.ratings.at(-1), CW[k]) > cut).length / xs.length * 100).toFixed(0).padStart(5); }).join(""));
// Ejemplos: los 3 más altos de algunos composites
for (const k of ["usage", "passing", "stealing", "blocking", "rebounding", "shootingAtRim", "fouling"]) {
	const xs = P.map((x) => [comp(x.ratings.at(-1), CW[k]), x]).sort((a, b) => b[0] - a[0]).slice(0, 6);
	console.log(`\n${k} — más altos: ` + xs.map(([v, x]) => `${x.lastName} (${x.ratings.at(-1).pos}) ${(v * 100).toFixed(0)}`).join(", "));
}

// Cruce con la realidad 2026 (planteles): goles, asistencias y amarillas cada 90'
const dirP = "/home/user/zengm/data/argentina/planteles/";
const real = new Map();
for (const f of readdirSync(dirP).filter((f) => f.endsWith(".json"))) {
	const p = JSON.parse(readFileSync(dirP + f, "utf8"));
	for (const j of p.jugadores) real.set(`${j.nombre}|${j.apellido}`, j);
}
const filas = [];
for (const x of P) {
	const j = real.get(`${x.firstName}|${x.lastName}`);
	if (!j || (j.min ?? 0) < 900 || j.amarillas === undefined) continue;
	const r = x.ratings.at(-1);
	filas.push({ pos: r.pos, g90: j.goles / j.min * 90, a90: (j.asist ?? 0) / j.min * 90, y90: (j.amarillas + 2 * (j.dobleAmarilla ?? 0) + 2 * (j.rojas ?? 0)) / j.min * 90,
		usage: comp(r, CW.usage), passing: comp(r, CW.passing), fouling: comp(r, CW.fouling), stealing: comp(r, CW.stealing) });
}
const corr = (a, b) => { const n = a.length, ma = a.reduce((s, v) => s + v, 0) / n, mb = b.reduce((s, v) => s + v, 0) / n; let c = 0, va = 0, vb = 0; for (let i = 0; i < n; i++) { c += (a[i] - ma) * (b[i] - mb); va += (a[i] - ma) ** 2; vb += (b[i] - mb) ** 2; } return c / Math.sqrt(va * vb); };
const sinArq = filas.filter((f) => f.pos !== "C");
console.log(`\nCruce con 2026 (${sinArq.length} jugadores de campo con 900' o más):`);
console.log(" goles/90 vs usage:", corr(sinArq.map((f) => f.g90), sinArq.map((f) => f.usage)).toFixed(2));
console.log(" asistencias/90 vs passing:", corr(sinArq.map((f) => f.a90), sinArq.map((f) => f.passing)).toFixed(2));
console.log(" tarjetas/90 vs fouling:", corr(sinArq.map((f) => f.y90), sinArq.map((f) => f.fouling)).toFixed(2));
console.log("\nPor puesto: tarjetas/90 reales vs fouling | goles/90 reales vs usage | asist/90 vs passing");
for (const p of POS) { const xs = filas.filter((f) => f.pos === p); if (!xs.length) continue; const m = (k) => xs.reduce((s, f) => s + f[k], 0) / xs.length; console.log(` ${p.padEnd(3)} n=${String(xs.length).padStart(2)}  tarjetas ${m("y90").toFixed(2)} / fouling ${(m("fouling") * 100).toFixed(0)}  |  goles ${m("g90").toFixed(2)} / usage ${(m("usage") * 100).toFixed(0)}  |  asist ${m("a90").toFixed(2)} / passing ${(m("passing") * 100).toFixed(0)}`); }
