// Compara la lista de arqueros del usuario (Torneo Apertura 2026, desactualizada)
// con los valores de hoy en los planteles cargados. Uso:
//
//   node tools/argentina/arqueros.ts ARCHIVO_DE_LIGA.json > data/argentina/arqueros/valores-actuales.md
//
// Lee data/argentina/arqueros/lista-apertura-2026.md (tal cual la mandó el
// usuario) y data/argentina/planteles/*.json. El archivo de liga solo se usa
// para decir dónde está hoy cada arquero de un equipo sin cargar.

import { readdirSync, readFileSync } from "node:fs";
import { basename } from "node:path";

const archivo = process.argv[2];
if (!archivo) {
	throw new Error("Uso: node arqueros.ts ARCHIVO_DE_LIGA.json");
}
const dir = new URL("../../data/argentina/", import.meta.url);
const norm = (s: string) =>
	s
		.normalize("NFD")
		.replace(/[̀-ͯ]/g, "")
		.toLowerCase()
		.trim();
// Siglas de la lista que en la liga son otras
const SIGLA: Record<string, string> = { INR: "IRM", AAE: "ERC" };

// 1. La lista
const texto = readFileSync(new URL("arqueros/lista-apertura-2026.md", dir), "utf8");
const bloque = texto.split("```")[1];
type Item = { valor: number; nombre: string; club: string };
const lista: Item[] = [];
for (const linea of bloque.split("\n")) {
	const m = /^(\d+) - (.+)$/.exec(linea.trim());
	if (!m || !m[2].includes("(")) {
		continue;
	}
	for (const parte of m[2].split(/\),\s*/)) {
		const x = /^(.+?) \(([A-Z]+)\)?$/.exec(parte.trim());
		if (!x) {
			throw new Error(`No entiendo: ${parte}`);
		}
		lista.push({ valor: Number(m[1]), nombre: x[1], club: SIGLA[x[2]] ?? x[2] });
	}
}

// 2. Los planteles cargados (un plantel en preparación, sin OVR, no cuenta)
const planteles = readdirSync(new URL("planteles/", dir))
	.filter((f) => f.endsWith(".json"))
	.map((f) => JSON.parse(readFileSync(new URL(`planteles/${f}`, dir), "utf8")))
	.filter((p) => p.jugadores.every((j: any) => typeof j.ovr === "number"));
const cargados = new Set(planteles.map((p) => p.equipo));
const arqueros = planteles.flatMap((p) =>
	p.jugadores
		.filter((j: any) => j.pos === "Portero")
		.map((j: any) => ({ ...j, equipo: p.equipo })),
);

// Mismo jugador: mismo nombre de pila y apellido igual o casi (Arzamendi/Arzamendia)
const mismo = (nombreLista: string, nombre: string, apellido: string) => {
	const [pila, ...resto] = nombreLista.split(" ");
	const a = norm(resto.join(" "));
	const b = norm(apellido);
	return (
		norm(pila) === norm(nombre.split(" ")[0]) &&
		(a === b || b.startsWith(a) || a.startsWith(b))
	);
};

// 3. Dónde está hoy cada uno en el archivo (para los equipos sin cargar)
const L = JSON.parse(readFileSync(archivo, "utf8"));
const abrev = Object.fromEntries(L.teams.map((t: any) => [t.tid, t.abbrev]));
const dondeEsta = (nombreLista: string) => {
	const p = L.players.find(
		(p: any) =>
			p.tid !== -2 &&
			p.ratings.at(-1).pos === "C" &&
			mismo(nombreLista, p.firstName, p.lastName),
	);
	if (!p) {
		return "no está en el archivo";
	}
	return p.tid >= 0 ? abrev[p.tid] : p.tid === -1 ? "libre" : "retirado";
};

const signo = (d: number) => (d > 0 ? `+${d}` : d < 0 ? `−${-d}` : "=");
const out: string[] = [];
out.push(
	"# Arqueros: lista del Apertura y valores de hoy",
	"",
	`Generado con \`tools/argentina/arqueros.ts\` sobre \`${basename(archivo)}\`.`,
	"La lista es la del usuario (`lista-apertura-2026.md`, desactualizada); \"hoy\" es",
	"el OVR de los planteles cargados. Se vuelve a generar al cargar cada equipo.",
	"",
	`## Equipos cargados (${cargados.size})`,
	"",
	"| Equipo | Arquero | Lista | Hoy | Cambio | PJ 2026 | Min |",
	"|---|---|---|---|---|---|---|",
);
const usados = new Set<Item>();
for (const j of [...arqueros].sort((a, b) => b.ovr - a.ovr || a.equipo.localeCompare(b.equipo))) {
	const it = lista.find((i) => mismo(i.nombre, j.nombre, j.apellido));
	if (it) {
		usados.add(it);
	}
	const cambio = it ? signo(j.ovr - it.valor) : "no estaba";
	const lst = it ? `${it.valor}${it.club !== j.equipo ? ` (${it.club})` : ""}` : "—";
	out.push(
		`| ${j.equipo} | ${j.nombre} ${j.apellido} | ${lst} | ${j.ovr} | ${cambio} | ${j.pj} | ${j.min} |`,
	);
}

const resto = lista.filter((i) => !usados.has(i));
const yaNo = resto.filter((i) => cargados.has(i.club));
const pendientes = resto.filter((i) => !cargados.has(i.club));
out.push(
	"",
	"## En la lista con un equipo cargado, pero hoy no están en su plantel",
	"",
	"| Lista | Arquero | Club en la lista | Hoy en el archivo |",
	"|---|---|---|---|",
	...yaNo.map((i) => `| ${i.valor} | ${i.nombre} | ${i.club} | ${dondeEsta(i.nombre)} |`),
	"",
	`## Equipos sin cargar: la lista es la base (${pendientes.length})`,
	"",
	"| Lista | Arquero | Club en la lista | Hoy en el archivo (datos 2023) |",
	"|---|---|---|---|",
	...pendientes.map((i) => `| ${i.valor} | ${i.nombre} | ${i.club} | ${dondeEsta(i.nombre)} |`),
	"",
);
console.log(out.join("\n"));
