// Uso: node --max-old-space-size=8000 tools/argentina/simulacion/sim-ganancia.mjs LIGA_SIMULADA.json (liga simulada exportada por el usuario; solo se lee)
import { readFileSync } from "node:fs";
const L = JSON.parse(readFileSync(process.argv[2], "utf8"));
const m = (a) => a.length ? (a.reduce((s, v) => s + v, 0) / a.length).toFixed(1) : "-";
const filas = {};
const porNivel = {};
for (const p of L.players) {
	const r26 = p.ratings.find((r) => r.season === 2026); if (!r26 || p.draft.year > 2025) continue;
	if (!(p.stats ?? []).some((s) => s.season === 2026 && s.tid >= 0)) continue;
	const e = 2026 - p.born.year; if (e > 26) continue;
	const pico = Math.max(...p.ratings.map((r) => r.ovr));
	const r31 = p.ratings.find((r) => r.season === 2031);
	(filas[e] ??= []).push({ g: pico - r26.ovr, pot: pico - r26.pot, o: r26.ovr, pico, g5: r31 ? r31.ovr - r26.ovr : null });
	if (e <= 20) { const b = r26.ovr >= 60 ? "60 o más" : r26.ovr >= 50 ? "50-59" : r26.ovr >= 40 ? "40-49" : "menos de 40"; (porNivel[b] ??= []).push(pico - r26.ovr); }
}
console.log("edad en 2026 | jugadores | OVR medio 2026 | pico medio | suba hasta el pico | pico − POT de 2026 | suba en 5 años (2031)");
for (const e of Object.keys(filas).map(Number).sort((a, b) => a - b)) {
	const xs = filas[e];
	console.log(`${e} | ${xs.length} | ${m(xs.map((x) => x.o))} | ${m(xs.map((x) => x.pico))} | +${m(xs.map((x) => x.g))} | ${m(xs.map((x) => x.pot))} | ${m(xs.filter((x) => x.g5 != null).map((x) => x.g5))}`);
}
console.log("\nJuveniles (20 o menos) según su OVR de 2026: suba media hasta el pico");
for (const [b, xs] of Object.entries(porNivel)) console.log(`  ${b}: ${xs.length} jugadores, +${m(xs)}`);
