// Rasgos de juego (arquetipos) que indicó el usuario, plantel por plantel. Uso:
//
//   node tools/argentina/rasgos-usuario.ts            # muestra lo que haría
//   node tools/argentina/rasgos-usuario.ts --aplicar
//
// Esta lista es la completa: reemplaza los rasgos que tenía cada jugador. Con
// "+", el efecto es una vez y media el normal (ver ratings-futbol.ts).

import { readdirSync, readFileSync, writeFileSync } from "node:fs";

// rasgo -> [equipo, apellido, nombre (si hace falta)]
const LISTA: Record<string, [string, string, string?][]> = {
	goleador: [["BOC", "Merentiel"], ["RAC", "Martínez", "Adrián"], ["VEL", "Martínez", "Ronaldo"], ["EST", "Alario"], ["IRM", "Arce", "+"], ["HUR", "Pussetto"], ["BEL", "Fernández"]],
	"larga distancia": [["VEL", "Lanzini"], ["ROS", "Di María"], ["IRM", "Florentín"], ["BEL", "González Metilli"], ["INS", "Luna"], ["NOB", "Soñora"], ["ERC", "Alanís"], ["UNI", "Pittón"], ["BAR", "Insúa", "Rodrigo"]],
	aereo: [["EST", "Palacios", "Tomás"], ["EST", "Rojo"], ["EST", "Gaich"], ["BOC", "Di Lollo"], ["BOC", "Valencia"], ["RIV", "Otamendi"], ["VEL", "Martínez", "Ronaldo"], ["EST", "Carrillo"], ["ARG", "Álvarez"], ["IRM", "Arce"], ["LAN", "Canale"], ["ARG", "Molina"], ["SLO", "Auzmendi"], ["HUR", "Caicedo"], ["BEL", "López"], ["INS", "Alarcón"], ["ERC", "Maffini"], ["UNI", "Estigarribia"], ["BAR", "Jappert"], ["BAR", "Campi"], ["BAR", "Bruera"]],
	gambeta: [["BOC", "Flores"], ["RIV", "Almada"], ["RIV", "Correa", "+"], ["RAC", "Zaracho"], ["SLO", "Farías"], ["EST", "Cetré"], ["EST", "Correa"], ["ROS", "Campaz"], ["ROS", "Di María"], ["ARG", "López Muñoz", "+"], ["IRM", "Fernández", "+"], ["LAN", "Moreno"], ["IND", "Montiel"], ["RAC", "Díaz"], ["TAL", "Rick"], ["BEL", "Zelarayán", "Lucas"]],
	veloz: [["BOC", "Villa", "+"], ["RAC", "Vergara"], ["SLO", "Barrios"], ["EST", "Meza"], ["EST", "Cetré"], ["SLO", "Cuello"], ["TAL", "Rick"], ["TAL", "Valoyes"], ["INS", "Córdoba"], ["NOB", "Mazzanti", "+"]],
	"pelota parada": [["ROS", "Di María"], ["ARG", "Mancuello"], ["IND", "Montiel"], ["BOC", "Paredes"], ["LAN", "Moreno"], ["VEL", "Valdés"], ["UNI", "Malcorra"], ["BAR", "Tapia"]],
	habilidoso: [["BOC", "Paredes"], ["RIV", "Almada"], ["RAC", "Miljevic"], ["EST", "Sosa"], ["ROS", "Di María", "+"], ["ARG", "López Muñoz"], ["GIM", "Fernández"], ["HUR", "Barticciotto"], ["TAL", "Cristaldo"], ["BEL", "Vázquez"], ["INS", "Luna"]],
	pase: [["BOC", "Paredes", "+"], ["VEL", "Valdés"], ["GIM", "Fernández"], ["RIV", "Almada"], ["ROS", "Campaz"], ["HUR", "Romero"], ["BEL", "Vázquez"]],
	cerebro: [["BOC", "Paredes"], ["VEL", "Robertone"], ["VEL", "Aliendro"], ["EST", "Neves"], ["GIM", "Barros Schelotto", "Nicolás"], ["TAL", "Fattori"], ["ERC", "Cabrera"], ["UNI", "Menossi"], ["BAR", "Rolón"]],
	centrador: [["RIV", "Montiel"], ["RIV", "Acuña"], ["VEL", "Gómez"], ["EST", "Benedetti"], ["EST", "Meza"], ["ROS", "Di María"], ["GIM", "Steimbach"], ["LAN", "Salvio"], ["ERC", "Alanís"], ["BAR", "Insúa", "Rodrigo"]],
	recuperador: [["BOC", "Ascacíbar"], ["BOC", "Paredes"], ["SLO", "Hernández"], ["EST", "Palacios", "Tomás"], ["EST", "Rojo"], ["ROS", "Ibarra"], ["IRM", "Studer"], ["GIM", "Barros Schelotto", "Nicolás"], ["LAN", "Canale"], ["HUR", "Pereyra"], ["TAL", "Fattori"], ["BEL", "Longo"], ["INS", "Abregú"], ["ERC", "Rosané"], ["ERC", "Cabrera"], ["BAR", "Gordillo"]],
	potente: [["BOC", "Giménez"], ["RAC", "Martínez", "Adrián"], ["IND", "Ávila"], ["SLO", "Arboleda"], ["SLO", "Herazo"], ["EST", "Gaich"], ["IRM", "Costa"], ["IRM", "Arce"], ["LAN", "Izquierdoz"], ["LAN", "Wlk"], ["RIE", "Quintana"], ["RIE", "Murillo"], ["HUR", "Nervo"], ["HUR", "Caicedo"], ["BEL", "Morales"], ["BAR", "Jappert"], ["BAR", "Rak"], ["BAR", "Tobio"], ["BAR", "Bruera"]],
	pulmon: [["RIV", "Portillo"], ["RIV", "Arambarri"], ["SLO", "Tripichio"], ["EST", "Piovi"], ["ROS", "Ibarra"], ["ROS", "Copetti"], ["ARG", "Oroz"], ["IRM", "Florentín"], ["GIM", "Steimbach"], ["GIM", "Miramón"], ["LAN", "Marcich"], ["RIE", "Céliz"], ["HUR", "Gil"], ["TAL", "Catalán"], ["TAL", "Schott"], ["INS", "Cerato"], ["NOB", "Solari"], ["ERC", "Cabrera"], ["ERC", "Talpone"]],
	tactico: [["BOC", "Pellegrino"], ["IND", "Arias"], ["EST", "González Pírez"], ["LAN", "Izquierdoz"], ["RIE", "Quintana"], ["HUR", "Blondel"], ["TAL", "Catalán"], ["INS", "Galván"], ["NOB", "Giannetti"]],
	reflejos: [["RAC", "Cambeses"], ["EST", "Muslera"], ["VEL", "Marchiori"]],
	achique: [["IND", "Rey"], ["HUR", "Galíndez"]],
	pies: [["IND", "Mele"], ["RIE", "Arce"]],
	lento: [["BOC", "Paredes"]],
};

const aplicar = process.argv.includes("--aplicar");
const dir = new URL("../../data/argentina/planteles/", import.meta.url);
const archivos = readdirSync(dir).filter((f) => f.endsWith(".json")).map((f) => {
	const texto = readFileSync(new URL(f, dir), "utf8");
	return { f, texto, d: JSON.parse(texto) };
});
const nuevos = new Map<any, string[]>();
for (const [rasgo, xs] of Object.entries(LISTA)) {
	for (const [equipo, apellido, extra] of xs) {
		const mas = extra === "+";
		const nombre = mas ? undefined : extra;
		const a = archivos.find((x) => x.d.equipo === equipo);
		if (!a) throw new Error(`No existe el plantel ${equipo}`);
		const m = a.d.jugadores.filter((j: any) => j.apellido === apellido && (!nombre || j.nombre === nombre) && !j.prospecto);
		if (m.length !== 1) throw new Error(`${equipo} ${nombre ?? ""} ${apellido}: ${m.length} coincidencias`);
		nuevos.set(m[0], [...(nuevos.get(m[0]) ?? []), rasgo + (mas ? "+" : "")]);
	}
}
const quitados: string[] = [];
for (const { f, texto, d } of archivos) {
	for (const j of d.jugadores) {
		const antes = j.rasgos ?? [];
		const despues = nuevos.get(j) ?? [];
		for (const r of antes) if (!despues.includes(r)) quitados.push(`${d.equipo} ${j.nombre} ${j.apellido}: ${r}`);
		if (despues.length) j.rasgos = despues;
		else delete j.rasgos;
	}
	if (aplicar) {
		writeFileSync(new URL(f, dir), JSON.stringify(d, null, "\t").replace(/"rasgos": \[\n\t+((?:"[^"]+",?\n\t+)+)\]/g, (_m, b) => `"rasgos": [${b.replace(/\n\t+/g, " ").trim().replace(/,$/, "")}]`) + (texto.endsWith("\n") ? "\n" : ""));
	}
}
console.log(`Jugadores con rasgos: ${nuevos.size}`);
for (const [j, rs] of nuevos) console.log(`  ${j.nombre} ${j.apellido}: ${rs.join(", ")}`);
console.log(`Rasgos que tenían y ya no: ${quitados.join("; ") || "ninguno"}`);
console.log(aplicar ? "Aplicado." : "(no se escribió nada)");
