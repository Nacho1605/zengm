// Datos de la escalera por puesto que ve el usuario (página en
// data/argentina/escalera/, publicada como artifact). Uso:
//
//   node tools/argentina/escalera-web.ts ARCHIVO.json [BASE.json]
//
// ARCHIVO: la versión armada que se muestra (nombres y colores de los
// equipos). BASE: una versión anterior para la columna de cambio ("Δ"); si no
// se da, no hay cambio. Escribe data/argentina/escalera/escalera.json.
//
// Los que jugaron en dos clubes en 2026: si el club anterior está en
// salidas-2026.json (mismo nombre y edad ±1, otro club), se suman sus números
// y se guarda el detalle ("otros").

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { DEFECTOS, FORMA_VIGENTE, RASGOS_AMBOS, RASGOS_ARQUERO } from "./ratings-futbol.ts";

const [archivo, baseArchivo] = process.argv.slice(2);
if (!archivo) {
	throw new Error("Uso: node escalera-web.ts ARCHIVO.json [BASE.json]");
}
const dir = new URL("../../data/argentina/", import.meta.url);
const leer = (ruta: string | URL) => JSON.parse(readFileSync(ruta, "utf8"));
const L = leer(archivo);
const base = baseArchivo ? leer(baseArchivo) : null;
const version = (archivo.match(/v\.([\d.]+)_futbol/) ?? [])[1] ?? "";
const versionBase = baseArchivo ? ((baseArchivo.match(/v\.([\d.]+)_futbol/) ?? [])[1] ?? "") : "";
const tablas = leer(new URL("tablas-2026.json", dir));
const rank = Object.fromEntries(tablas.anual.map((r: any) => [r.equipo, r]));
const salidas = leer(new URL("salidas-2026.json", dir)).jugadores;
const norm = (s: string) =>
	s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
const G: Record<string, string> = {
	Portero: "ARQ",
	"Defensa central": "CEN",
	"Lateral izquierdo": "LAT",
	"Lateral derecho": "LAT",
	Pivote: "MED",
	Mediocentro: "MED",
	"Interior derecho": "MED",
	"Interior izquierdo": "MED",
	"Mediocentro ofensivo": "OFE",
	Mediapunta: "OFE",
	"Extremo izquierdo": "OFE",
	"Extremo derecho": "OFE",
	"Delantero centro": "DEL",
	"Segundo delantero": "DEL",
};

// OVR de la versión base, por nombre y año de nacimiento
const ovrBase = new Map<string, number>();
for (const p of base?.players ?? []) {
	if (p.tid >= -2) {
		ovrBase.set(`${norm(p.firstName)}|${norm(p.lastName)}|${p.born.year}`, p.ratings.at(-1).ovr);
	}
}

const jugadores: any[] = [];
const equipos: any[] = [];
const plantelDir = new URL("planteles/", dir);
for (const f of readdirSync(plantelDir).filter((f) => f.endsWith(".json")).sort()) {
	const p = leer(new URL(f, plantelDir));
	const eq = p.equipo;
	const t = L.teams.find((x: any) => x.abbrev === eq);
	const r = rank[eq];
	const maxMin = Math.max(...p.jugadores.map((j: any) => j.min ?? 0));
	const tieneEntro = p.jugadores.some((j: any) => j.entro !== undefined);
	const tieneAsist = p.jugadores.some((j: any) => j.asist !== undefined);
	for (const j of p.jugadores) {
		const y = Number(j.nac.split("/")[2]);
		const edad = 2026 - y;
		const fich = j.fichado ? j.fichado.split("/").map(Number) : null;
		const otros = salidas
			.filter(
				(s: any) =>
					s.club !== eq &&
					norm(`${s.nombre} ${s.apellido}`) === norm(`${j.nombre} ${j.apellido}`) &&
					Math.abs((s.edad ?? edad) - edad) <= 1 &&
					(s.pj ?? 0) > 0,
			)
			.map((s: any) => ({ club: s.club, pj: s.pj ?? 0, min: s.min ?? 0, gol: s.goles ?? 0, as: s.asist ?? null }));
		const pj = j.pj ?? 0;
		const min = j.min ?? 0;
		const gol = j.goles ?? 0;
		const as = tieneAsist ? (j.asist ?? 0) : null;
		jugadores.push({
			eq,
			g: G[j.pos],
			pos: j.pos,
			n: j.nombre,
			a: j.apellido,
			ovr: j.ovr,
			antes: base ? (ovrBase.get(`${norm(j.nombre)}|${norm(j.apellido)}|${y}`) ?? null) : null,
			edad,
			// En el club (columnas propias) y en el año (con el otro club)
			pjClub: pj,
			minClub: min,
			pj: pj + otros.reduce((a: number, o: any) => a + o.pj, 0),
			tit: tieneEntro ? pj - (j.entro ?? 0) : null,
			min: min + otros.reduce((a: number, o: any) => a + o.min, 0),
			pct: maxMin ? Math.round((min / maxMin) * 100) : 0,
			gol: gol + otros.reduce((a: number, o: any) => a + o.gol, 0),
			as: as === null ? null : as + otros.reduce((a: number, o: any) => a + (o.as ?? 0), 0),
			otros,
			val: j.valor ?? null,
			sofa: j.sofascore ?? null,
			ppp: j.ppp ?? null,
			r: j.rasgos ?? [],
			medio: !!(fich && fich[2] === 2026 && fich[1] >= 7),
			les: j.lesion?.partidos ?? null,
			pros: !!j.prospecto,
			cap: !!j.capitan,
			mano: !!j.ratings,
			pie: j.pie ?? null,
			// Posiciones secundarias (Transfermarkt), si están cargadas
			sec: j.secundarias ?? [],
		});
	}
	const once = p.jugadores
		.filter((j: any) => !j.prospecto)
		.map((j: any) => j.ovr)
		.sort((a: number, b: number) => b - a)
		.slice(0, 11);
	equipos.push({
		eq,
		nombre: `${t.region} ${t.name}`,
		colores: t.colors,
		pos: r.pos,
		pts: r.pts,
		gf: r.gf,
		gc: r.gc,
		once: Number((once.reduce((a: number, b: number) => a + b) / 11).toFixed(1)),
	});
}
equipos.sort((a, b) => b.once - a.once);
const hoy = new Date();
const salida = new URL("escalera/escalera.json", dir);
writeFileSync(
	salida,
	JSON.stringify({
		version: version ? `v${version}` : "",
		versionBase: versionBase ? `v${versionBase}` : "",
		fecha: `${hoy.getDate()}/${hoy.getMonth() + 1}/${hoy.getFullYear()}`,
		equipos,
		jugadores,
		// Rasgos que se pueden elegir en la página (los de la forma vigente).
		// arquero: true solo arqueros, false solo jugadores de campo, sin dato
		// los dos; defecto: va en el grupo "Defectos"
		rasgos: Object.keys(FORMA_VIGENTE.rasgos)
			.filter((k) => k !== "pegador")
			.map((k) => ({
				k,
				arquero: RASGOS_ARQUERO.includes(k) ? true : RASGOS_AMBOS.includes(k) ? undefined : false,
				defecto: DEFECTOS.includes(k),
			})),
	}),
);
const dos = jugadores.filter((j) => j.otros.length);
console.log(
	`${jugadores.length} jugadores de ${equipos.length} equipos; con números en dos clubes: ${dos.length}`,
);
console.log(dos.map((j) => `${j.a} (${j.eq} + ${j.otros.map((o: any) => o.club).join(", ")})`).join(", "));
