// Trae a los archivos de datos los cambios que el usuario hizo dentro del juego
// (su liga exportada), para que no se pierdan al volver a armar el archivo.
// Uso:
//
//   node tools/argentina/desde-juego.ts LIGA_EXPORTADA.json
//
// - Planteles (data/argentina/planteles/*.json): fotos, camisetas que asignó
//   el juego y ratings ajustados a mano (se guardan exactos en "ratings").
// - Equipos (data/argentina/equipos-usuario.json): ciudad, apodo,
//   abreviatura, logos, colores, camiseta, población y estadio.
// Imprime todo lo que cambió. No toca la configuración de la liga.

import { readdirSync, readFileSync, writeFileSync } from "node:fs";

const [exportada] = process.argv.slice(2);
if (!exportada) {
	throw new Error("Uso: node desde-juego.ts LIGA_EXPORTADA.json");
}

const U = JSON.parse(readFileSync(exportada, "utf8"));
const dir = new URL("../../data/argentina/", import.meta.url);
const KEYS = [
	"stre",
	"spd",
	"jmp",
	"endu",
	"ins",
	"dnk",
	"ft",
	"fg",
	"tp",
	"oiq",
	"diq",
	"drb",
	"pss",
	"reb",
];
const limpiar = (u: string) =>
	u.replaceAll(/[&?]utm_[^&]*/g, "").replace(/^([^?]*)&/, "$1?");

// Los cambios se miden contra el archivo armado más reciente del repositorio
const armados = readdirSync(dir)
	.filter((f) => /^BBGM_Argentina_2026_v\..*_futbol\.json$/.test(f))
	.sort((a, b) =>
		a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }),
	);
const base = JSON.parse(readFileSync(new URL(armados.at(-1)!, dir), "utf8"));
const clave = (p: any) => `${p.firstName} ${p.lastName} ${p.born.year}`;
const enBase = new Map(base.players.map((p: any) => [clave(p), p]));

// ---------------------------------------------------------------- Planteles
const resumen: Record<string, string[]> = {
	fotos: [],
	camisetas: [],
	ratings: [],
	noEncontrados: [],
};
for (const archivo of readdirSync(new URL("planteles/", dir))) {
	if (!archivo.endsWith(".json")) {
		continue;
	}
	const ruta = new URL(`planteles/${archivo}`, dir);
	const d = JSON.parse(readFileSync(ruta, "utf8"));
	const team = U.teams.find((t: any) => t.abbrev === d.equipo);
	let cambios = 0;
	for (const j of d.jugadores) {
		const y = Number(j.nac.slice(-4));
		const p = U.players.find(
			(q: any) =>
				q.firstName === j.nombre &&
				q.lastName === j.apellido &&
				q.born.year === y &&
				(q.tid === team?.tid || (j.prospecto && q.tid === -2)),
		);
		if (!p) {
			resumen.noEncontrados!.push(`${j.nombre} ${j.apellido} (${d.equipo})`);
			continue;
		}
		if (p.imgURL && limpiar(p.imgURL) !== j.imgURL) {
			j.imgURL = limpiar(p.imgURL);
			resumen.fotos!.push(`${j.apellido} (${d.equipo})`);
			cambios += 1;
		}
		if (!j.n && p.jerseyNumber && !j.prospecto) {
			j.n = p.jerseyNumber;
			resumen.camisetas!.push(`${j.apellido} #${p.jerseyNumber}`);
			cambios += 1;
		}
		const r = p.ratings.at(-1);
		const b = (enBase.get(clave(p)) as any)?.ratings.at(-1);
		if (b && KEYS.some((k) => b[k] !== r[k])) {
			j.ratings = Object.fromEntries(KEYS.map((k) => [k, r[k]]));
			resumen.ratings!.push(`${j.nombre} ${j.apellido} ${j.ovr}→${r.ovr}`);
			j.ovr = r.ovr;
			cambios += 1;
		}
	}
	if (cambios > 0) {
		writeFileSync(ruta, JSON.stringify(d, null, "\t"));
	}
}

// ---------------------------------------------------------------- Equipos
const rutaEquipos = new URL("equipos-usuario.json", dir);
const usuario = JSON.parse(readFileSync(rutaEquipos, "utf8"));
const CAMPOS = [
	"region",
	"name",
	"abbrev",
	"imgURL",
	"imgURLSmall",
	"colors",
	"jersey",
	"pop",
	"stadiumCapacity",
];
const equipos: string[] = [];
for (const t of U.teams) {
	const o = base.teams.find((x: any) => x.tid === t.tid);
	if (!o) {
		continue;
	}
	for (const f of CAMPOS) {
		const nuevo = f.startsWith("img") ? limpiar(t[f] ?? "") : t[f];
		if (JSON.stringify(nuevo) !== JSON.stringify(o[f])) {
			usuario.equipos[t.tid] ??= { _equipo: o.abbrev };
			usuario.equipos[t.tid][f] = nuevo;
			equipos.push(`${o.abbrev}.${f}`);
		}
	}
}
if (equipos.length > 0) {
	writeFileSync(rutaEquipos, JSON.stringify(usuario, null, "\t"));
}

console.log(`Comparado contra ${armados.at(-1)}`);
for (const [k, v] of Object.entries(resumen)) {
	console.log(`${k}: ${v.length}${v.length ? ` — ${v.join(", ")}` : ""}`);
}
console.log(
	`equipos: ${equipos.length}${equipos.length ? ` — ${equipos.join(", ")}` : ""}`,
);
