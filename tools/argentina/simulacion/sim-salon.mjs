// Uso: node --max-old-space-size=8000 tools/argentina/simulacion/sim-salon.mjs LIGA_SIMULADA.json [UMBRAL] (solo lee)
// Puntaje de Salón de la Fama de cada retirado, con la misma cuenta del juego
// (src/worker/core/player/madeHof.basketball.ts): win shares y EWA de la carrera
// (cada playoff cuenta aparte) + los 5 mejores años − 50, más el ajuste por
// temporadas anteriores al comienzo de la liga
import { readFileSync } from "node:fs";
const L = JSON.parse(readFileSync(process.argv[2], "utf8"));
const umbral = process.argv[3] ? Number(process.argv[3]) : null;
const ga = Array.isArray(L.gameAttributes) ? Object.fromEntries(L.gameAttributes.map((x) => [x.key, x.value])) : L.gameAttributes;
const v = (x) => (Array.isArray(x) ? x.at(-1).value : x);
const inicio = ga.startingSeason;
export const puntaje = (p) => {
	let e = Infinity;
	const w = (p.stats ?? []).map((ps) => { let s = 0; for (const k of ["dws", "ows", "ewa"]) if (typeof ps[k] === "number") s += ps[k]; if (ps.season < e) e = ps.season; return s / 2; }).sort((a, b) => b - a);
	let t = 0, df = -50;
	w.forEach((x, i) => { t += x; if (i < 5) df += x; });
	const f = Math.min(e, inicio) - p.draft.year - 5;
	if (f > 0 && w[0] !== undefined) t += w[0] * f;
	return t + df;
};
const escala = Math.sqrt((v(ga.numPeriods) * v(ga.quarterLength)) / 48) * v(ga.numGames) / 82;
console.log(`umbral del juego = 120 × ${escala.toFixed(4)} × hofFactor (${v(ga.hofFactor)}) = ${(120 * escala * v(ga.hofFactor)).toFixed(1)}`);
const ret = L.players.filter((p) => p.tid === -3 && p.retiredYear >= inicio + 1).map((p) => ({ n: `${p.firstName} ${p.lastName}`, s: puntaje(p), ret: p.retiredYear }));
for (const n of ["Ángel Di María", "Leandro Paredes"]) { const x = ret.find((r) => r.n === n); console.log(`${n}: ${x ? x.s.toFixed(1) + " (se retiró en " + x.ret + ")" : "no está retirado"}`); }
if (umbral != null) {
	const pasan = ret.filter((r) => r.s > umbral).sort((a, b) => b.s - a.s);
	console.log(`Con umbral ${umbral}: entrarían ${pasan.length} de ${ret.length} retirados: ${pasan.map((r) => `${r.n} ${r.s.toFixed(1)}`).join(", ")}`);
}
