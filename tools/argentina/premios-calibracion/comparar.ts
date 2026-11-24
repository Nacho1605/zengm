import { readFileSync, writeFileSync } from "node:fs";
import { filas, ranking, nombre, evaluar } from "./calc.ts";
const nuevo = JSON.parse(readFileSync("/home/user/zengm/data/argentina/premios-para-importar.json", "utf8")).gameAttributes.awards;
const L = JSON.parse(readFileSync(process.env.RESUMEN ?? "/tmp/resumen.json", "utf8"));
const S: Record<number, any[]> = { 2026: filas(2026), 2027: filas(2027) };
let md = "| Premio | 2026 | 2027 |\n|---|---|---|\n";
for (const a of nuevo) {
	if (a.statRange !== undefined) continue; // playoffs: dependen de cada serie
	const celdas = [2026, 2027].map((season) => {
		const fs = S[season]!;
		if (a.mip) {
			if (season === 2026) return "— (primera temporada)";
			const ant = new Map(S[2026]!.filter((f) => f.gp * f.min >= 500).map((f) => [f.pid, f]));
			const r = fs.filter((f) => f.gp * f.min >= 500 && ant.has(f.pid)).map((f) => ({ f, s: evaluar(a, f) - evaluar(a, ant.get(f.pid)!) })).sort((x, y) => y.s - x.s);
			return nombre(r[0]!.f);
		}
		if (a.group === "conf") {
			const cid = (f: any) => L.T.find((t: any) => t.tid === f.tid)?.cid;
			return [0, 1].map((c) => (c === 0 ? "Metro: " : "Fed: ") + nombre(ranking(a, fs, (f) => cid(f) === c)[0]!.f)).join("; ");
		}
		const r = ranking(a, fs, (f) => (!a.bench || f.bench) && (!a.rookie || f.rookie));
		return a.numTeams ? r.slice(0, 5).map((x) => nombre(x.f)).join(", ") : nombre(r[0]!.f);
	});
	md += `| ${a.name} | ${celdas.join(" | ")} |\n`;
}
writeFileSync(process.env.SALIDA ?? "/tmp/ganadores.md", md);
console.log(md);
