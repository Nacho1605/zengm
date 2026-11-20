// Trae a los archivos de datos los cambios que el usuario hizo dentro del juego
// (su liga exportada), para que no se pierdan al volver a armar el archivo.
// Uso:
//
//   node tools/argentina/desde-juego.ts LIGA_EXPORTADA.json [VERSION_BASE.json]
//
// VERSION_BASE: el archivo del repositorio sobre el que jugó el usuario. Si no
// se da, se usa el más reciente. Darlo siempre que haya una versión más nueva
// que la que usó el usuario: si no, los OVR cambiados después parecerían
// "ratings ajustados a mano" y volverían al valor viejo.
//
// - Planteles (data/argentina/planteles/*.json): fotos, camisetas que asignó
//   el juego, ratings ajustados a mano (se guardan exactos en "ratings") y
//   parientes nuevos (en "parientes", de un solo lado: el cargador los une en
//   los dos sentidos).
// - Equipos (data/argentina/equipos-usuario.json): ciudad, apodo,
//   abreviatura, logos, colores, camiseta, población y estadio.
// Imprime todo lo que cambió. No toca la configuración de la liga.

import { readdirSync, readFileSync, writeFileSync } from "node:fs";

const [exportada, versionBase] = process.argv.slice(2);
if (!exportada) {
	throw new Error(
		"Uso: node desde-juego.ts LIGA_EXPORTADA.json [VERSION_BASE.json]",
	);
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

// Los cambios se miden contra la versión que usó el usuario (por defecto, el
// archivo armado más reciente del repositorio)
const armados = readdirSync(dir)
	.filter((f) => /^BBGM_Argentina_2026_v\..*_futbol\.json$/.test(f))
	.sort((a, b) =>
		a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }),
	);
const rutaBase = versionBase ?? new URL(armados.at(-1)!, dir);
const base = JSON.parse(readFileSync(rutaBase, "utf8"));
const clave = (p: any) => `${p.firstName} ${p.lastName} ${p.born.year}`;
const enBase = new Map(base.players.map((p: any) => [clave(p), p]));

// ---------------------------------------------------------------- Planteles
const resumen: Record<string, string[]> = {
	fotos: [],
	camisetas: [],
	ratings: [],
	parientes: [],
	noEncontrados: [],
};
const planteles = readdirSync(new URL("planteles/", dir))
	.filter((archivo) => archivo.endsWith(".json"))
	.map((archivo) => {
		const ruta = new URL(`planteles/${archivo}`, dir);
		const texto = readFileSync(ruta, "utf8");
		return { ruta, texto, d: JSON.parse(texto), cambios: 0 };
	});
// Parientes ya anotados (en cualquiera de los dos lados), para no repetirlos
const norm = (s: string) =>
	s
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLowerCase();
const pares = new Set<string>();
const par = (a: string, b: string) => [norm(a), norm(b)].sort().join(" | ");
for (const { d } of planteles) {
	for (const j of d.jugadores) {
		for (const r of j.parientes ?? []) {
			pares.add(par(`${j.nombre} ${j.apellido}`, r.nombre));
		}
	}
}
for (const pl of planteles) {
	const { d } = pl;
	const team = U.teams.find((t: any) => t.abbrev === d.equipo);
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
			pl.cambios += 1;
		}
		if (!j.n && p.jerseyNumber && !j.prospecto) {
			j.n = p.jerseyNumber;
			resumen.camisetas!.push(`${j.apellido} #${p.jerseyNumber}`);
			pl.cambios += 1;
		}
		const r = p.ratings.at(-1);
		const bp = enBase.get(clave(p)) as any;
		const b = bp?.ratings.at(-1);
		if (b && KEYS.some((k) => b[k] !== r[k])) {
			j.ratings = Object.fromEntries(KEYS.map((k) => [k, r[k]]));
			resumen.ratings!.push(`${j.nombre} ${j.apellido} ${j.ovr}→${r.ovr}`);
			j.ovr = r.ovr;
			pl.cambios += 1;
		}
		// Parientes nuevos (los que el usuario agregó en el juego)
		for (const rel of p.relatives ?? []) {
			if ((bp?.relatives ?? []).some((x: any) => x.pid === rel.pid)) {
				continue;
			}
			const otro = U.players.find((q: any) => q.pid === rel.pid);
			const nombre = otro ? `${otro.firstName} ${otro.lastName}` : rel.name;
			const clavePar = par(`${j.nombre} ${j.apellido}`, nombre);
			if (pares.has(clavePar)) {
				continue;
			}
			pares.add(clavePar);
			j.parientes = [...(j.parientes ?? []), { tipo: rel.type, nombre }];
			resumen.parientes!.push(`${j.nombre} ${j.apellido} (${rel.type}) ${nombre}`);
			pl.cambios += 1;
		}
	}
}
for (const { ruta, texto, d, cambios } of planteles) {
	if (cambios > 0) {
		writeFileSync(
			ruta,
			JSON.stringify(d, null, "\t").replace(
				/"rasgos": \[\n\t+"aereo"\n\t+\]/g,
				'"rasgos": ["aereo"]',
			) + (texto.endsWith("\n") ? "\n" : ""),
		);
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

console.log(`Comparado contra ${versionBase ?? armados.at(-1)}`);
for (const [k, v] of Object.entries(resumen)) {
	console.log(`${k}: ${v.length}${v.length ? ` — ${v.join(", ")}` : ""}`);
}
console.log(
	`equipos: ${equipos.length}${equipos.length ? ` — ${equipos.join(", ")}` : ""}`,
);
