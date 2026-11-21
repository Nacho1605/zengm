// Escalera de OVR por posición entre los equipos cargados, con los datos de
// Transfermarkt de cada jugador, para comparar valoraciones. Uso:
//
//   node tools/argentina/escalera.ts ARCHIVO.json [OVR_MINIMO=52] [EQUIPO ...]
//
// Con EQUIPO (abreviaturas), marca con ">>" a los jugadores de esos equipos.

import { readdirSync, readFileSync } from "node:fs";

const [file, minimoTxt = "52", ...marcar] = process.argv.slice(2);
if (!file) {
	throw new Error(
		"Uso: node escalera.ts ARCHIVO.json [OVR_MINIMO] [EQUIPO ...]",
	);
}
const minimo = Number(minimoTxt);
const L = JSON.parse(readFileSync(file, "utf8"));
const dir = new URL("../../data/argentina/planteles/", import.meta.url);

// Datos de los planteles cargados
const datos = new Map<string, any>();
const equipos: string[] = [];
for (const f of readdirSync(dir).filter((x) => x.endsWith(".json"))) {
	const d = JSON.parse(readFileSync(new URL(f, dir), "utf8"));
	equipos.push(d.equipo);
	for (const j of d.jugadores) {
		datos.set(`${d.equipo} ${j.nombre} ${j.apellido}`, j);
	}
}
const abbrev = new Map(L.teams.map((t: any) => [t.tid, t.abbrev]));
const ps = L.players.filter((p: any) =>
	equipos.includes(abbrev.get(p.tid) as string),
);

const fuerza = equipos
	.map((a) => {
		const o = ps
			.filter((p: any) => abbrev.get(p.tid) === a)
			.map((p: any) => p.ratings.at(-1).ovr)
			.sort((x: number, y: number) => y - x)
			.slice(0, 11);
		return [a, o.reduce((x: number, y: number) => x + y, 0) / 11] as const;
	})
	.sort((a, b) => b[1] - a[1]);
console.log(
	`Once (promedio de los 11 mejores): ${fuerza.map(([a, v]) => `${a} ${v.toFixed(1)}`).join(" | ")}`,
);

const GRUPOS: Record<string, string[]> = {
	Arqueros: ["C"],
	Centrales: ["FC", "PF"],
	Laterales: ["GF"],
	"Pivotes y volantes": ["G", "SG"],
	"Mediapuntas y extremos": ["PG", "SF"],
	Delanteros: ["F"],
};
for (const [grupo, pos] of Object.entries(GRUPOS)) {
	console.log(`\n${grupo}`);
	const lista = ps
		.filter((p: any) => pos.includes(p.pos) && p.ratings.at(-1).ovr >= minimo)
		.sort((a: any, b: any) => b.ratings.at(-1).ovr - a.ratings.at(-1).ovr);
	for (const p of lista) {
		const a = abbrev.get(p.tid) as string;
		const j = datos.get(`${a} ${p.firstName} ${p.lastName}`) ?? {};
		console.log(
			[
				marcar.includes(a) ? ">>" : "  ",
				String(p.ratings.at(-1).ovr),
				(p.firstName ? `${p.firstName[0]}. ${p.lastName}` : p.lastName).padEnd(22),
				a,
				`${L.gameAttributes.season - p.born.year} años`,
				`${j.pj ?? "-"} PJ`,
				`${j.min ?? "-"}'`,
				`${j.goles ?? "-"} g`,
				`${((j.valor ?? 0) / 1e6).toFixed(1)} M€`,
				p.moodTraits?.includes("L") ? "leal" : "",
			].join(" "),
		);
	}
}
