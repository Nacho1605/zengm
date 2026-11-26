// Uso: node --max-old-space-size=8000 tools/argentina/simulacion/sim-curva.mjs LIGA_SIMULADA.json (liga simulada exportada por el usuario; solo se lee)
// Liga simulada del usuario: cambio de OVR por edad (todos los jugadores, temporada a temporada)
import { readFileSync } from "node:fs";
const L = JSON.parse(readFileSync(process.argv[2], "utf8"));
const porEdad = {};
const K = ["stre","spd","jmp","endu","ins","dnk","ft","fg","tp","oiq","diq","drb","pss","reb"];
const porEdadK = {};
for (const p of L.players) {
	const rs = [...p.ratings].sort((a, b) => a.season - b.season);
	for (let i = 1; i < rs.length; i++) {
		const a = rs[i - 1], b = rs[i];
		if (b.season !== a.season + 1 || a.season < 2026) continue;
		const edad = b.season - p.born.year; // edad en la temporada nueva (la del desarrollo)
		(porEdad[edad] ??= []).push(b.ovr - a.ovr);
		const o = (porEdadK[edad] ??= Object.fromEntries(K.map((k) => [k, 0])));
		for (const k of K) o[k] += b[k] - a[k];
	}
}
console.log("edad | casos | cambio medio de OVR | cambio medio por rating");
for (const e of Object.keys(porEdad).map(Number).sort((a, b) => a - b)) {
	const xs = porEdad[e]; if (xs.length < 30 || e < 17 || e > 36) continue;
	const m = xs.reduce((a, b) => a + b, 0) / xs.length;
	console.log(`${e} | ${xs.length} | ${m >= 0 ? "+" : ""}${m.toFixed(2)} | ${K.map((k) => k + " " + (porEdadK[e][k] / xs.length).toFixed(1)).join(" ")}`);
}
const ta = L.teams.filter((t) => !t.disabled).length;
console.log("equipos:", L.teams.length, "activos:", ta);
