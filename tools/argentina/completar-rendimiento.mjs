// Completa el Rendimiento 2026 de un plantel ya cargado y agrega sus salidas.
// Uso: node tools/argentina/completar-rendimiento.mjs EQUIPO
// Las filas (transcriptas de las capturas) están en
// data/argentina/rendimiento/EQUIPO.mjs. Para los planteles cargados antes de
// que se guardara el Rendimiento completo (los 13 primeros, RIE a LAN).
import { readFileSync, writeFileSync } from "node:fs";

const eq = process.argv[2];
const { FILAS, FECHA } = await import(new URL(`../../data/argentina/rendimiento/${eq}.mjs`, import.meta.url).href);
const base = "/home/user/zengm/data/argentina/";
const norm = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
const COLS = ["convocado", "pj", "goles", "asist", "amarillas", "dobleAmarilla", "rojas", "entro", "salio", "ppp", "min"];
const ORDEN = ["pj", "goles", "min", "asist", "amarillas", "dobleAmarilla", "rojas", "entro", "salio", "ppp", "convocado"];

const f = `${base}planteles/${eq}.json`;
const p = JSON.parse(readFileSync(f, "utf8"));
const usados = new Set();
const salidas = [];
const cambios = [];
for (const [nombre, pos, edad, pais, r] of FILAS) {
	const j = p.jugadores.find((j) => norm(`${j.nombre} ${j.apellido}`) === norm(nombre));
	const s = Object.fromEntries(COLS.map((c, i) => [c, r[i] ?? 0]));
	if (r.length <= 2) s.pj = 0; // no alineado
	if (!j) {
		// Nombres de pila compuestos: "Juan Pablo", "José María", etc.
		const DOBLES = ["Juan Miguel", "Juan Pablo", "Juan Cruz", "Juan Carlos", "Juan Fernando", "José María", "Juan Manuel", "Juan Ignacio", "Juan José"];
		const doble = DOBLES.find((d) => nombre.startsWith(d + " "));
		const n = doble ?? nombre.split(" ")[0];
		const a = nombre.slice(n.length + 1).split(" ");
		const o = { club: eq, nombre: n, apellido: a.join(" "), pos, edad, pais };
		if (s.pj === 0) Object.assign(o, { convocado: s.convocado, pj: 0 });
		else for (const c of COLS) o[c] = s[c];
		salidas.push(o);
		continue;
	}
	usados.add(j);
	for (const k of ["pj", "goles", "min"]) {
		if ((j[k] ?? 0) !== s[k]) cambios.push(`${j.apellido} ${k} ${j[k] ?? 0}→${s[k]}`);
	}
	// Mismas claves y orden que los planteles con Rendimiento completo
	const nuevo = {};
	for (const [k, v] of Object.entries(j)) {
		if (ORDEN.includes(k)) continue;
		nuevo[k] = v;
		if (k === "valor") for (const c of ORDEN) nuevo[c] = s[c];
	}
	Object.keys(j).forEach((k) => delete j[k]);
	Object.assign(j, nuevo);
}
const faltan = p.jugadores.filter((j) => !usados.has(j));
if (faltan.length) throw new Error(`Sin Rendimiento: ${faltan.map((j) => j.apellido).join(", ")}`);
p.fuente = p.fuente.replace("Transfermarkt, plantel y rendimiento 2026 (capturas del usuario)", `Transfermarkt, plantel y rendimiento 2026 (capturas del usuario; rendimiento completo del ${FECHA})`);
writeFileSync(f, JSON.stringify(p, null, "\t") + "\n");

// Salidas: una línea por jugador, como el resto del archivo
const sf = `${base}salidas-2026.json`;
const txt = readFileSync(sf, "utf8");
const previas = JSON.parse(txt).jugadores.filter((s) => s.club === eq);
// Salidas que ya estaban (dadas a mano antes, ej. IND): se reemplazan por
// las de la captura, conservando sus notas y su Sofascore
const extra = (o) => {
	const p = previas.find((x) => norm(`${x.nombre} ${x.apellido}`) === norm(`${o.nombre} ${o.apellido}`));
	if (p?.nota) o.nota = p.nota;
	if (p?.sofascore) o.sofascore = p.sofascore;
	return o;
};
for (const o of salidas) extra(o);
const fmt = (o) => "\t\t{ " + Object.entries(o).map(([k, v]) => `${JSON.stringify(k)}: ${JSON.stringify(v)}`).join(", ") + " }";
const i = txt.lastIndexOf("]");
const sinPrevias = previas.length ? txt.split("\n").filter((l) => !l.includes(`"club": "${eq}"`)).join("\n").replace(/,\n\t\]/, "\n\t]") : txt;
const i2 = sinPrevias.lastIndexOf("]");
const nuevoTxt = sinPrevias.slice(0, i2).trimEnd() + ",\n" + salidas.map(fmt).join(",\n") + "\n\t]\n}\n";
JSON.parse(nuevoTxt);
writeFileSync(sf, nuevoTxt);
console.log(`${eq}: ${usados.size} del plantel actualizados, ${salidas.length} salidas`);
console.log(cambios.length ? `Cambios en PJ, goles o minutos: ${cambios.join(", ")}` : "PJ, goles y minutos: iguales a los guardados");
console.log(`Salidas: ${salidas.map((s) => `${s.nombre} ${s.apellido} (${s.pj} PJ${s.min ? ", " + s.min + "'" : ""})`).join(", ")}`);
