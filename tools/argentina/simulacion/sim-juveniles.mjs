// Uso: node --max-old-space-size=8000 tools/argentina/simulacion/sim-juveniles.mjs LIGA_SIMULADA.json (liga simulada exportada por el usuario; solo se lee)
import { readFileSync } from "node:fs";
const L = JSON.parse(readFileSync(process.argv[2], "utf8"));
const T = Object.fromEntries(L.teams.map((t) => [t.tid, t.abbrev]));
const info = (p) => {
	const rs = [...p.ratings].sort((a, b) => a.season - b.season);
	const r26 = rs.find((r) => r.season === 2026);
	let pico = rs[0]; for (const r of rs) if (r.ovr > pico.ovr) pico = r;
	const st26 = (p.stats ?? []).find((x) => x.season === 2026 && x.tid >= 0);
	return { p, rs, r26, pico, edadPico: pico.season - p.born.year, eq26: st26 ? T[st26.tid] : (p.ratings.length ? "" : "") };
};
const todos = L.players.map(info);
// 1) Los 25 picos más altos de toda la simulación
console.log(`Los 25 picos más altos (2026-${Math.max(...L.players.flatMap((p) => p.ratings.map((r) => r.season)))}):`);
for (const x of [...todos].sort((a, b) => b.pico.ovr - a.pico.ovr).slice(0, 25)) {
	const o = x.p.draft.year >= 2026 ? `draft ${x.p.draft.year} (generado)` : `2026: ${x.r26 ? x.r26.ovr + "/" + x.r26.pot : "?"} a los ${2026 - x.p.born.year}`;
	console.log(`  ${x.p.firstName} ${x.p.lastName} | pico ${x.pico.ovr} en ${x.pico.season} (${x.edadPico} años) | ${o}`);
}
// 2) Juveniles de 2026 (20 o menos, en equipos en 2026)
const juv = todos.filter((x) => x.r26 && x.p.draft.year <= 2026 && 2026 - x.p.born.year <= 20 && (x.p.stats ?? []).some((s) => s.season === 2026 && s.tid >= 0));
const dif = juv.map((x) => x.pico.ovr - x.r26.ovr);
const potDif = juv.map((x) => x.pico.ovr - x.r26.pot);
const m = (a) => a.reduce((s, v) => s + v, 0) / a.length;
console.log(`\nJuveniles de 2026 (20 o menos, en equipos): ${juv.length}. Subieron hasta su pico, en promedio, ${m(dif).toFixed(1)} sobre su OVR de 2026; el pico quedó ${m(potDif).toFixed(1)} respecto del POT que mostraba el juego en 2026. Edad media del pico: ${m(juv.map((x) => x.edadPico)).toFixed(1)}`);
const c = (f) => juv.filter(f).length;
console.log(`  pico 80 o más: ${c((x) => x.pico.ovr >= 80)}, 75-79: ${c((x) => x.pico.ovr >= 75 && x.pico.ovr < 80)}, 70-74: ${c((x) => x.pico.ovr >= 70 && x.pico.ovr < 75)}, 60-69: ${c((x) => x.pico.ovr >= 60 && x.pico.ovr < 70)}, menos de 60: ${c((x) => x.pico.ovr < 60)}`);
for (const x of [...juv].sort((a, b) => b.pico.ovr - a.pico.ovr).slice(0, 15)) console.log(`  ${x.p.firstName} ${x.p.lastName}: 2026 ${x.r26.ovr}/${x.r26.pot} (${2026 - x.p.born.year} años) → pico ${x.pico.ovr} a los ${x.edadPico}`);
// 3) Draft generado: por clase, el mejor pico y el pico medio de los 10 primeros elegidos
console.log("\nDraft generado (clases 2026-2035): OVR al ser elegido y pico");
for (let y = 2026; y <= 2035; y++) {
	const cls = todos.filter((x) => x.p.draft.year === y && x.p.draft.round >= 1);
	if (!cls.length) continue;
	const elegidos = cls.filter((x) => x.p.draft.pick > 0 && x.p.draft.round === 1).sort((a, b) => a.p.draft.pick - b.p.draft.pick).slice(0, 10);
	const enDraft = (x) => x.rs.find((r) => r.season === y)?.ovr;
	const picos = cls.map((x) => x.pico.ovr).sort((a, b) => b - a);
	console.log(`  ${y}: ${cls.length} elegidos | 10 primeros: OVR al draft ${m(elegidos.map(enDraft).filter((v) => v != null)).toFixed(1)}, pico medio ${m(elegidos.map((x) => x.pico.ovr)).toFixed(1)} | mejores picos de la clase ${picos.slice(0, 5).join(" ")}`);
}
const reales26 = todos.filter((x) => x.r26 && x.p.draft.year <= 2025 && 2026 - x.p.born.year === 19 && (x.p.stats ?? []).some((s) => s.season === 2026 && s.tid >= 0));
console.log(`\nComparación: los juveniles reales de 19 años en 2026 (${reales26.length}) tenían OVR medio ${m(reales26.map((x) => x.r26.ovr)).toFixed(1)} y llegaron a un pico medio de ${m(reales26.map((x) => x.pico.ovr)).toFixed(1)}`);
