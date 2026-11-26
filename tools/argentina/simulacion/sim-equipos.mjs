// Uso: node --max-old-space-size=8000 tools/argentina/simulacion/sim-equipos.mjs LIGA_SIMULADA.json (liga simulada exportada por el usuario; solo se lee)
// Fuerza de los equipos por temporada: promedio de los 11 y de los 18 mejores de cada equipo (los que jugaron esa temporada)
import { readFileSync } from "node:fs";
const L = JSON.parse(readFileSync(process.argv[2], "utf8"));
const ultima = Math.max(...L.players.flatMap((p) => (p.stats ?? []).filter((x) => !x.playoffs && x.gp > 0).map((x) => x.season)));
const m = (a) => a.reduce((s, v) => s + v, 0) / a.length;
const filas = [];
for (let s = 2026; s <= ultima; s++) {
	const eq = {};
	for (const p of L.players) {
		const r = p.ratings.find((r) => r.season === s); if (!r) continue;
		const st = (p.stats ?? []).filter((x) => x.season === s && !x.playoffs && x.gp > 0 && x.tid >= 0);
		if (!st.length) continue;
		const tid = st.sort((a, b) => b.gp - a.gp)[0].tid;
		(eq[tid] ??= []).push(r.ovr);
	}
	const t11 = [], t18 = [], mejor = [], peor = [];
	for (const xs of Object.values(eq)) { xs.sort((a, b) => b - a); if (xs.length < 18) continue; t11.push(m(xs.slice(0, 11))); t18.push(m(xs.slice(0, 18))); }
	t11.sort((a, b) => b - a);
	filas.push(`${s} | ${t11.length} equipos | 11 mejores: promedio ${m(t11).toFixed(1)} (el equipo más fuerte ${t11[0].toFixed(1)}, el más flojo ${t11.at(-1).toFixed(1)}) | 18 mejores: ${m(t18).toFixed(1)}`);
}
console.log(filas.join("\n"));
