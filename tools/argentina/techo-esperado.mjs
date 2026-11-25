// Techo esperado de un jugador con distintas formas de ratings (mismo OVR): las reglas
// de crecimiento del juego (src/worker/core/player/developSeason.basketball.ts),
// promediadas por integración numérica, sin azar. Sirve para ver si la forma cambia
// el potencial (no lo cambia: el juego suma lo mismo a cada rating sin importar su
// valor; solo frena el tope de 100). Uso:
//   node tools/argentina/techo-esperado.mjs EQUIPO APELLIDO OVR "rasgo1,rasgo2" ["rasgo1+" ...]
// (el POT que muestra el juego es optimista y con azar: unos 4 arriba de este techo, ±2)
import { readFileSync } from "node:fs";
import { generarRatings, ovrOficial, FORMA_VIGENTE, posicion } from "./ratings-futbol.ts";
const [eq, apellido, ovrTxt, ...variantes] = process.argv.slice(2);
const d = JSON.parse(readFileSync(new URL(`../../data/argentina/planteles/${eq}.json`, import.meta.url), "utf8"));
const js = d.jugadores.filter((j) => j.apellido === apellido);
if (js.length !== 1) throw new Error(`${eq} ${apellido}: ${js.length} coincidencias`);
const flores = js[0];
const EDAD = 2026 - Number(flores.nac.split("/")[2]);
const POS = posicion(flores.pos, flores.pie ?? null);
const K = ["stre","spd","jmp","endu","ins","dnk","ft","fg","tp","oiq","diq","drb","pss","reb"];
const shoot = (a) => (a <= 27 ? 0 : a <= 29 ? 0.5 : a <= 31 ? 1.5 : 2);
const iq = (a) => (a <= 21 ? 4 : a <= 23 ? 3 : a <= 27 ? 0 : a <= 29 ? 0.5 : a <= 31 ? 1.5 : 2);
const F = {
	stre: [() => 0, () => [-1e9, 1e9]], spd: [(a) => (a <= 27 ? 0 : -2), () => [-12, 2]], jmp: [(a) => (a <= 26 ? 0 : -3), () => [-12, 2]],
	endu: [null, () => [-11, 19]], dnk: [(a) => (a <= 27 ? 0 : 0.5), () => [-3, 13]], ins: [shoot, () => [-3, 13]], ft: [shoot, () => [-3, 13]],
	fg: [shoot, () => [-3, 13]], tp: [shoot, () => [-3, 13]], oiq: [iq, (a) => (a >= 24 ? [-3, 9] : [-3, 7 + 5 * (24 - a)])], diq: [iq, (a) => (a >= 24 ? [-3, 9] : [-3, 7 + 5 * (24 - a)])],
	drb: [shoot, () => [-2, 5]], pss: [shoot, () => [-2, 5]], reb: [shoot, () => [-2, 5]],
};
// normal: puntos de cuadratura
const N = 400, gz = [], gw = [];
for (let i = 0; i < N; i++) { const z = -6 + (12 * (i + 0.5)) / N; gz.push(z); gw.push(Math.exp(-z * z / 2)); }
const sw = gw.reduce((a, b) => a + b); for (let i = 0; i < N; i++) gw[i] /= sw;
const U = Array.from({ length: 40 }, (_, i) => 0.4 + (i + 0.5) / 40);
const bnd = (x, lo, hi) => Math.max(lo, Math.min(hi, x));
const base0 = (a) => (a <= 21 ? 2 : a <= 25 ? 1 : a <= 27 ? 0 : a <= 29 ? -1 : -2);
const esperado = (k, a) => {
	let s = 0;
	for (let i = 0; i < N; i++) {
		const ruido = a <= 23 ? bnd(5 * gz[i], -4, 20) : a <= 25 ? bnd(5 * gz[i], -4, 10) : bnd(3 * gz[i], -2, 4);
		const B = base0(a) + ruido;
		const [lo, hi] = F[k][1](a);
		let t = 0;
		const mods = k === "endu" ? (a <= 23 ? Array.from({ length: 18 }, (_, j) => (9 * (j + 0.5)) / 18) : [a <= 30 ? 0 : -2]) : [F[k][0](a)];
		for (const M of mods) for (const u of U) t += bnd((B + M) * u, lo, hi);
		s += gw[i] * t / (mods.length * U.length);
	}
	return s;
};
const techo = (r0, edad) => {
	const r = { ...r0 }; let max = ovrOficial(r);
	for (let a = edad + 1; a < 30; a++) {
		for (const k of K) r[k] = Math.max(0, Math.min(100, r[k] + esperado(k, a)));
		max = Math.max(max, ovrOficial(r));
	}
	return max;
};
const potJuego = (o, e) => (e >= 29 ? o : Math.round(72.31428908571982 - 2.33062761 * e + 0.83308748 * o));
const ver = (nombre, r) => console.log(`${nombre.padEnd(40)} OVR ${ovrOficial(r)} | techo esperado ${techo(r, EDAD)} | POT del juego (fórmula) ${potJuego(ovrOficial(r), EDAD)} | ${K.map((k) => k + " " + Math.round(r[k])).join(" ")}`);
const g = (rasgos, ovr) => generarRatings({ ...flores, rasgos }, POS, EDAD, ovr, FORMA_VIGENTE);
console.log(`${flores.nombre} ${flores.apellido}, ${EDAD} años, ${POS}`);
ver(`hoy (${flores.ovr}; ${(flores.rasgos ?? []).join(", ")})`, g(flores.rasgos ?? [], flores.ovr));
for (const v of variantes.length ? variantes : [(flores.rasgos ?? []).join(",")]) {
	const rs = v ? v.split(",").map((x) => x.trim()) : [];
	ver(`${ovrTxt}: ${rs.join(", ") || "sin rasgos"}`, g(rs, Number(ovrTxt)));
}
