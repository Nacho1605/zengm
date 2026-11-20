// Muestra planteles con sus datos, por línea (Arqueros, Centrales, Laterales,
// Mediocampistas, Ofensivos, Delanteros) y de mayor a menor OVR. Uso:
//
//   node tools/argentina/ver-equipo.ts EQUIPO [EQUIPO ...]
//
// Cada jugador: OVR (ª = ratings ajustados a mano), edad, PJ, miles de
// minutos, goles, valor en M€, P = prospecto, ½ = llegó en julio o después.
import { readFileSync } from "node:fs";
const G: Record<string, string> = { Portero: "ARQ", "Defensa central": "CEN", "Lateral izquierdo": "LAT", "Lateral derecho": "LAT", Pivote: "MED", Mediocentro: "MED", "Interior derecho": "MED", "Interior izquierdo": "MED", "Mediocentro ofensivo": "OFE", Mediapunta: "OFE", "Extremo izquierdo": "OFE", "Extremo derecho": "OFE", "Delantero centro": "DEL", "Segundo delantero": "DEL" };
for (const e of process.argv.slice(2)) {
	const d = JSON.parse(readFileSync(`data/argentina/planteles/${e}.json`, "utf8"));
	console.log(`\n== ${e} ==`);
	for (const g of ["ARQ", "CEN", "LAT", "MED", "OFE", "DEL"]) {
		const js = d.jugadores.filter((j: any) => G[j.pos] === g).sort((a: any, b: any) => b.ovr - a.ovr);
		console.log(`${g}: ` + js.map((j: any) => `${j.ovr}${j.ratings ? "ª" : ""} ${j.apellido}(${2026 - +j.nac.slice(-4)}a ${j.pj}pj ${Math.round(j.min / 100) / 10}k ${j.goles}g ${((j.valor ?? 0) / 1e6).toFixed(1)}M${j.prospecto ? " P" : ""}${j.fichado && +j.fichado.slice(-4) === 2026 && +j.fichado.slice(3, 5) >= 7 ? " ½" : ""})`).join(", "));
	}
}
