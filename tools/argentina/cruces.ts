// Jugadores que jugaron en dos equipos en 2026: cruza salidas-2026.json (los
// que se fueron de un club ya cargado, con sus números) con los planteles
// cargados. Para cada uno muestra los números de los dos clubes y la suma,
// para valorarlo con la temporada completa (retroactivo). Uso:
//
//   node tools/argentina/cruces.ts
//
// También lista a los que llegaron a mitad de año (fichados en julio de 2026
// o después) sin números del club anterior en salidas-2026.json: a esos hay
// que valorarlos por partido, o pedirle al usuario sus números previos.

import { readdirSync, readFileSync } from "node:fs";

const dir = new URL("../../data/argentina/", import.meta.url);
const norm = (s: string) =>
	s
		.normalize("NFD")
		.replace(/[̀-ͯ]/g, "")
		.toLowerCase();
const salidas = JSON.parse(
	readFileSync(new URL("salidas-2026.json", dir), "utf8"),
).jugadores;
const planteles = readdirSync(new URL("planteles/", dir))
	.filter((f) => f.endsWith(".json"))
	.map((f) =>
		JSON.parse(readFileSync(new URL(`planteles/${f}`, dir), "utf8")),
	);

const linea = (x: any) =>
	`${x.pj ?? 0} PJ, ${x.goles ?? 0} g${x.asist !== undefined ? `, ${x.asist} a` : ""}, ${x.min ?? 0}'`;

console.log("Con números en dos clubes cargados:");
let n = 0;
for (const s of salidas) {
	for (const p of planteles) {
		if (p.equipo === s.club) {
			continue;
		}
		for (const j of p.jugadores) {
			if (norm(`${j.nombre} ${j.apellido}`) !== norm(`${s.nombre} ${s.apellido}`)) {
				continue;
			}
			n += 1;
			console.log(
				`  ${j.nombre} ${j.apellido}: ${s.club} (${linea(s)}) + ${p.equipo} (${linea(j)}) = ${(s.pj ?? 0) + j.pj} PJ, ${(s.goles ?? 0) + j.goles} g, ${(s.min ?? 0) + j.min}' | OVR actual ${j.ovr}`,
			);
		}
	}
}
if (n === 0) {
	console.log("  (ninguno)");
}

console.log("\nLlegaron en julio de 2026 o después (valorar por partido):");
for (const p of planteles) {
	const xs = p.jugadores.filter((j: any) => {
		if (!j.fichado) {
			return false;
		}
		const [, m, y] = j.fichado.split("/").map(Number);
		return y === 2026 && m >= 7;
	});
	if (xs.length > 0) {
		console.log(
			`  ${p.equipo}: ${xs.map((j: any) => `${j.apellido} (${j.fichado}, ${j.pj} PJ, ${j.min}')`).join(", ")}`,
		);
	}
}
