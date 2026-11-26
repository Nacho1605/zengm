// Uso: node --max-old-space-size=8000 tools/argentina/simulacion/sim-escala.mjs LIGA_SIMULADA.json (liga simulada exportada por el usuario; solo se lee)
// Escala de la liga simulada por temporada: jugadores con partidos jugados esa temporada (en un equipo)
import { readFileSync } from "node:fs";
const L = JSON.parse(readFileSync(process.argv[2], "utf8"));
const reales = new Set(); // los que ya estaban en 2026 (con ratings de 2026)
for (const p of L.players) if (p.ratings.some((r) => r.season === 2026) && p.draft.year <= 2025) reales.add(p.pid);
const filas = [];
const ultima = Math.max(...L.players.flatMap((p) => (p.stats ?? []).filter((x) => !x.playoffs && x.gp > 0).map((x) => x.season)));
for (let s = 2026; s <= ultima; s++) {
	const xs = [];
	for (const p of L.players) {
		const st = (p.stats ?? []).filter((x) => x.season === s && !x.playoffs && x.gp > 0 && x.tid >= 0);
		if (!st.length) continue;
		const r = p.ratings.find((r) => r.season === s); if (!r) continue;
		xs.push({ o: r.ovr, e: s - p.born.year, real: reales.has(p.pid), gen: p.draft.year >= 2026 });
	}
	xs.sort((a, b) => b.o - a.o);
	const at = (k) => xs[k - 1]?.o;
	const top100 = xs.slice(0, 100);
	const med = xs[Math.floor(xs.length / 2)].o;
	filas.push(`${s} | ${xs.length} | 1.º ${at(1)} 10.º ${at(10)} 30.º ${at(30)} 100.º ${at(100)} 200.º ${at(200)} mediana ${med} | top100: reales ${top100.filter((x) => x.real).length}, del draft generado ${top100.filter((x) => x.gen).length}, edad media ${(top100.reduce((a, x) => a + x.e, 0) / 100).toFixed(1)}`);
}
console.log("temporada | jugadores | escala | quiénes son los 100 mejores\n" + filas.join("\n"));
