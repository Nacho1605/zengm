// Cambia el OVR de un jugador en su plantel. Si tiene ratings ajustados a mano
// por el usuario ("ratings"), los sube o baja parejo (todos menos la altura y,
// en los arqueros, el tiro, que queda en 0) hasta llegar al OVR nuevo, para
// conservar la forma que les dio el usuario. Uso:
//
//   node tools/argentina/ajustar-ovr.ts EQUIPO APELLIDO OVR_NUEVO [NOMBRE]

import { readFileSync, writeFileSync } from "node:fs";

const [equipo, apellido, ovrTxt, nombre] = process.argv.slice(2);
if (!equipo || !apellido || !ovrTxt) {
	throw new Error("Uso: node ajustar-ovr.ts EQUIPO APELLIDO OVR_NUEVO [NOMBRE]");
}
const meta = Number(ovrTxt);

// OVR oficial de BBGM (el mismo de cargar-plantel.ts)
const ovrOficial = (r: Record<string, number>) => {
	const x =
		0.159 * (r.hgt! - 47.5) +
		0.0777 * (r.stre! - 50.2) +
		0.123 * (r.spd! - 50.8) +
		0.051 * (r.jmp! - 48.7) +
		0.0632 * (r.endu! - 39.9) +
		0.0126 * (r.ins! - 42.4) +
		0.0286 * (r.dnk! - 49.5) +
		0.0202 * (r.ft! - 47.0) +
		0.0726 * (r.tp! - 47.1) +
		0.133 * (r.oiq! - 46.8) +
		0.159 * (r.diq! - 46.7) +
		0.059 * (r.drb! - 54.8) +
		0.062 * (r.pss! - 51.3) +
		0.01 * (r.fg! - 47.0) +
		0.01 * (r.reb! - 51.4) +
		48.5;
	let fudge;
	if (x >= 68) {
		fudge = 8;
	} else if (x >= 50) {
		fudge = 4 + (x - 50) * (4 / 18);
	} else if (x >= 42) {
		fudge = -5 + (x - 42) * (9 / 8);
	} else if (x >= 31) {
		fudge = -5 - (42 - x) * (5 / 11);
	} else {
		fudge = -10;
	}
	return Math.min(100, Math.max(0, Math.round(x + fudge)));
};

const ruta = `data/argentina/planteles/${equipo}.json`;
const texto = readFileSync(ruta, "utf8");
const d = JSON.parse(texto);
const js = d.jugadores.filter(
	(j: any) => j.apellido === apellido && (!nombre || j.nombre === nombre),
);
if (js.length !== 1) {
	throw new Error(`${equipo} ${apellido}: ${js.length} coincidencias`);
}
const j = js[0];
const antes = j.ovr;
if (j.ratings) {
	const r: Record<string, number> = {
		...j.ratings,
		hgt: Math.round(((j.altura * 100 - 156) * 100) / 44),
	};
	const arquero = j.pos === "Portero";
	const claves = Object.keys(j.ratings).filter(
		(k) => !(arquero && ["ins", "dnk", "fg", "tp"].includes(k)),
	);
	const paso = Math.sign(meta - ovrOficial(r));
	// Todos parejo hasta cruzar el OVR buscado
	for (let i = 0; i < 100 && paso !== 0; i++) {
		const o = ovrOficial(r);
		if ((paso > 0 && o >= meta) || (paso < 0 && o <= meta)) {
			break;
		}
		for (const k of claves) {
			r[k] = Math.max(0, Math.min(100, r[k]! + paso));
		}
	}
	// Retoque fino con la inteligencia (defensiva en el fondo, ofensiva arriba)
	const llave = ["Portero", "Defensa central", "Lateral izquierdo", "Lateral derecho", "Pivote"].includes(j.pos)
		? "diq"
		: "oiq";
	for (let i = 0; i < 20 && ovrOficial(r) !== meta; i++) {
		r[llave] = r[llave]! + (ovrOficial(r) < meta ? 1 : -1);
	}
	if (ovrOficial(r) !== meta) {
		throw new Error(`${apellido}: no llega a OVR ${meta}`);
	}
	const cambios = claves
		.filter((k) => r[k] !== j.ratings[k])
		.map((k) => `${k} ${j.ratings[k]}→${r[k]}`);
	j.ratings = Object.fromEntries(claves.map((k) => [k, r[k]]).concat(
		Object.keys(j.ratings).filter((k) => !claves.includes(k)).map((k) => [k, j.ratings[k]]),
	));
	console.log(`${apellido}: ratings ${cambios.join(", ")}`);
}
j.ovr = meta;
writeFileSync(
	ruta,
	JSON.stringify(d, null, "\t").replace(/"rasgos": \[\n\t+"aereo"\n\t+\]/g, '"rasgos": ["aereo"]') +
		(texto.endsWith("\n") ? "\n" : ""),
);
console.log(`${equipo} ${j.nombre} ${apellido}: OVR ${antes} → ${meta}`);
