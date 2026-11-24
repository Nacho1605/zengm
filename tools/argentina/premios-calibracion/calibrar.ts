import { readFileSync } from "node:fs";
import { filas, ranking, nombre, evaluar } from "./calc.ts";
const L = JSON.parse(readFileSync("/home/user/zengm/data/argentina/premios-para-importar.json", "utf8"));
const aw = (s: string) => structuredClone(L.gameAttributes.awards.find((a: any) => a.shortName === s));
const conFactor = (a: any, pos: string, f: number) => { a.formulaByPos[pos] = a.formulaByPos[pos].replace(/^[\d.]+ \*/, `${f} *`); return a; };
const cuenta = (r: any[], n: number) => { const c: Record<string, number> = {}; for (const x of r.slice(0, n)) c[x.f.pos] = (c[x.f.pos] ?? 0) + 1; return JSON.stringify(c); };
const S = { 2026: filas(2026), 2027: filas(2027) } as Record<number, any[]>;
for (const season of [2026, 2027]) {
	const fs = S[season]!;
	console.log(`\n===== ${season}`);
	// Ballon d'Or: top 10 por puesto con variantes
	for (const [fF, fPG, fC] of [[1.1, 0.92, 0.65], [1.2, 0.92, 0.65], [1.2, 0.88, 0.6]]) {
		const a = aw("BDO"); conFactor(a, "F", fF); conFactor(a, "PG", fPG); conFactor(a, "C", fC);
		const r = ranking(a, fs);
		console.log(`BDO F${fF} PG${fPG} C${fC}:`, cuenta(r, 10), "|", r.slice(0, 6).map((x) => `${nombre(x.f)} ${x.s.toFixed(2)}`).join(" | "));
	}
	for (const fF of [1.1, 1.15, 1.2, 1.25]) {
		const a = conFactor(aw("TOTS-A"), "F", fF); const r = ranking(a, fs);
		console.log(`TSA F${fF}:`, cuenta(r, 5), r.slice(0, 5).map((x) => x.f.n.split(" ").at(-1)).join(", "));
	}
	const d = conFactor(aw("DPOY"), "G", 0.75); console.log("DPOY G0.75:", ranking(d, fs).slice(0, 3).map((x) => `${nombre(x.f)} ${x.s.toFixed(2)}`).join(" | "));
	for (const c of [0.55, 0.45]) { const b = conFactor(aw("ROY"), "C", c); console.log(`BTY C${c}:`, ranking(b, fs, (f) => f.rookie).slice(0, 4).map((x) => `${nombre(x.f)} ${x.s.toFixed(2)}`).join(" | ")); }
	const g = aw("Golden Glove"); console.log("GG:", ranking(g, fs).slice(0, 3).map((x) => `${nombre(x.f)} ${x.s.toFixed(2)}`).join(" | "));
}
// MIP: diferencia 2027 - 2026, con 500' o más en los dos años
const mipViejo = aw("MIP");
const mipNuevo = { ...mipViejo, formula: "min(1, gp*min/600)^0.5 * (per/15 + (obpm + dbpm + 3)/3)" };
for (const [nom, a] of [["MIP actual", mipViejo], ["MIP calidad", mipNuevo]] as const) {
	const ant = new Map(S[2026]!.filter((f) => f.gp * f.min >= 500).map((f) => [f.pid, f]));
	const r = S[2027]!.filter((f) => f.gp * f.min >= 500 && ant.has(f.pid)).map((f) => ({ f, s: evaluar(a, f) - evaluar(a, ant.get(f.pid)!) })).sort((x, y) => y.s - x.s);
	console.log(`\n${nom}:`, r.slice(0, 6).map((x) => `${nombre(x.f)} OVR ${x.f.ovr} ${x.s.toFixed(2)} (min ${Math.round(ant.get(x.f.pid)!.gp*ant.get(x.f.pid)!.min)}→${Math.round(x.f.gp*x.f.min)})`).join(" | "));
}
