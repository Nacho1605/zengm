// Recalcula los puntajes de los premios con las estadísticas de la liga simulada
import { readFileSync } from "node:fs";
import { FormulaEvaluator } from "./FormulaEvaluator.ts";
const R = JSON.parse(readFileSync(process.env.RESUMEN ?? "/tmp/resumen.json", "utf8"));
const teamWinp = new Map<string, number>();
for (const t of R.T) for (const s of t.seasons) { const gp = s.won + s.lost + (s.tied ?? 0); if (gp) teamWinp.set(`${t.tid}|${s.season}`, (s.won + 0.5 * (s.tied ?? 0)) / gp); }
const abbrev = new Map(R.T.map((t: any) => [t.tid, t.abbrev]));
export type Fila = Record<string, number> & { pid: number; n: string; pos: string; tid: number; season: number; rookie: boolean; bench: boolean; ovr: number };
// Una fila por jugador y temporada (temporada regular, sumando los clubes)
export const filas = (season: number, playoffs = false): Fila[] => {
	const out: Fila[] = [];
	for (const p of R.P) {
		const rows = p.stats.filter((s: any) => s.season === season && !!s.playoffs === playoffs && s.gp > 0);
		if (!rows.length) continue;
		const sum = (k: string) => rows.reduce((a: number, r: any) => a + (r[k] ?? 0), 0);
		const minT = sum("min");
		const pond = (k: string) => (minT > 0 ? rows.reduce((a: number, r: any) => a + (r[k] ?? 0) * r.min, 0) / minT : 0);
		const gp = sum("gp");
		const last = rows.at(-1);
		const tsa = sum("fga") + 0.44 * sum("fta");
		const f: any = {
			pid: p.pid, n: p.n, pos: p.pos[season] ?? Object.values(p.pos).at(-1), tid: last.tid, season, ovr: p.ovr[season],
			gp, gs: sum("gs"), min: minT / gp, pts: sum("pts") / gp, ast: sum("ast") / gp, tov: sum("tov") / gp,
			blk: sum("blk") / gp, drb: sum("drb") / gp, stl: sum("stl") / gp, trb: (sum("drb") + sum("orb")) / gp,
			per: pond("per"), obpm: pond("obpm"), dbpm: pond("dbpm"), astp: pond("astp"),
			tsp: tsa > 0 ? (100 * sum("pts")) / (2 * tsa) : 0,
			winp: teamWinp.get(`${last.tid}|${season}`) ?? 0.5, seasonFraction: Math.min(1, gp / 43),
		};
		const gs = f.gs;
		f.bench = gs === 0 || gp / gs > 2;
		f.rookie = p.draft?.year === season - 1;
		out.push(f);
	}
	return out;
};
const VARS = ["gp","gs","min","pts","ast","tov","blk","drb","stl","trb","per","obpm","dbpm","astp","tsp","winp","seasonFraction","teamGp","numWon","numWonConsecutive","ws","ows","dws","ewa","vorp","fg","fga"];
export const evaluar = (award: any, f: Fila) => {
	const formula = award.formulaByPos?.[f.pos] ?? award.formula;
	return new FormulaEvaluator(formula, VARS, ["numWon", "numWonConsecutive"]).evaluate(f as any) as number;
};
export const ranking = (award: any, fs: Fila[], filtro: (f: Fila) => boolean = () => true) =>
	fs.filter(filtro).map((f) => ({ f, s: evaluar(award, f) })).filter((x) => x.s > -500).sort((a, b) => b.s - a.s);
export const nombre = (f: Fila) => `${f.pos} ${f.n} (${abbrev.get(f.tid)})`;
