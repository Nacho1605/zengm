// Extrae de una liga exportada por el usuario (con temporadas jugadas) lo que
// hace falta para recalcular los premios. Uso:
//   node extraer.mjs LIGA.json /tmp/resumen.json
// Después: RESUMEN=/tmp/resumen.json node comparar.ts (ganadores con los
// premios de data/argentina/premios-para-importar.json) o calibrar.ts
// (variantes de pesos). calc.ts reproduce los puntajes del juego (comprobado
// con la liga del 24/11: los 5 primeros de cada premio, iguales).
// FormulaEvaluator.ts es copia del juego (src/worker/util), sin "helpers".
import { readFileSync, writeFileSync } from "node:fs";
const [entrada, salida] = process.argv.slice(2);
const L = JSON.parse(readFileSync(entrada, "utf8"));
const T = L.teams.map((t) => ({ tid: t.tid, abbrev: t.abbrev, cid: t.cid, seasons: (t.seasons || []).map((s) => ({ season: s.season, won: s.won, lost: s.lost, tied: s.tied })) }));
const K = ["season", "playoffs", "tid", "gp", "gs", "min", "pts", "fga", "fta", "fg", "ast", "tov", "blk", "drb", "orb", "stl", "per", "obpm", "dbpm", "astp", "dws", "ows", "ewa", "vorp"];
const P = L.players.map((p) => ({ pid: p.pid, n: `${p.firstName} ${p.lastName}`, draft: p.draft, born: p.born.year, pos: Object.fromEntries(p.ratings.map((r) => [r.season, r.pos])), ovr: Object.fromEntries(p.ratings.map((r) => [r.season, r.ovr])), stats: (p.stats || []).map((s) => Object.fromEntries(K.map((k) => [k, s[k]]))) }));
writeFileSync(salida, JSON.stringify({ T, P }));
console.log(`${T.length} equipos, ${P.length} jugadores`);
