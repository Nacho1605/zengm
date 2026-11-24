// Rasgos de juego (arquetipos) que indicó el usuario, plantel por plantel. Uso:
//
//   node tools/argentina/rasgos-usuario.ts            # muestra lo que haría
//   node tools/argentina/rasgos-usuario.ts --aplicar
//
// Esta lista es la completa: reemplaza los rasgos que tenía cada jugador. Con
// "+", el efecto es una vez y media el normal (ver ratings-futbol.ts).

import { readdirSync, readFileSync, writeFileSync } from "node:fs";

// rasgo -> [equipo, apellido, nombre (si hace falta), "+" (versión fuerte)]
const LISTA: Record<string, [string, string, ...string[]][]> = {
	goleador: [["BOC", "Merentiel"], ["RAC", "Martínez", "Adrián"], ["VEL", "Martínez", "Ronaldo"], ["EST", "Alario"], ["INR", "Arce", "+"], ["HUR", "Pussetto"], ["BEL", "Fernández"], ["BEL", "Passerini"], ["BOC", "Bareiro"], ["GIM", "Torres", "Franco"], ["TAL", "Álvarez"]],
	"larga distancia": [["VEL", "Lanzini"], ["INR", "Florentín"], ["BEL", "González Metilli"], ["INS", "Luna"], ["NOB", "Soñora"], ["ERC", "Alanís"], ["UNI", "Pittón"], ["BAR", "Insúa", "Rodrigo"], ["BOC", "Paredes"], ["RIV", "Moreno"]],
	aereo: [["EST", "Palacios", "Tomás"], ["EST", "Rojo"], ["EST", "Gaich"], ["BOC", "Di Lollo"], ["RIV", "Otamendi"], ["ARG", "Álvarez"], ["INR", "Arce"], ["LAN", "Canale"], ["ARG", "Molina"], ["SLO", "Auzmendi"], ["HUR", "Caicedo"], ["BEL", "López"], ["INS", "Alarcón"], ["ERC", "Maffini"], ["UNI", "Estigarribia"], ["BAR", "Jappert"], ["BAR", "Campi"], ["BAR", "Bruera"], ["BOC", "Valencia", "+"], ["EST", "Carrillo", "+"], ["GIM", "Conti"], ["RAC", "Martínez"], ["VEL", "Martínez", "+"]],
	gambeta: [["BOC", "Flores"], ["RIV", "Almada"], ["RAC", "Zaracho"], ["SLO", "Farías"], ["EST", "Cetré"], ["EST", "Correa"], ["ROS", "Campaz"], ["ROS", "Di María"], ["ARG", "López Muñoz", "+"], ["LAN", "Moreno"], ["IND", "Montiel"], ["RAC", "Díaz"], ["TAL", "Rick"], ["BEL", "Zelarayán", "Lucas"], ["BOC", "Romero"], ["INR", "Fernández"], ["RIV", "Correa"], ["RIV", "Driussi"], ["UNI", "Malcorra"]],
	veloz: [["BOC", "Villa", "+"], ["RAC", "Vergara"], ["EST", "Cetré"], ["SLO", "Cuello"], ["TAL", "Rick"], ["TAL", "Valoyes"], ["INS", "Córdoba"], ["NOB", "Mazzantti", "+"], ["EST", "Meza", "+"], ["SLO", "Barrios", "+"], ["SLO", "Cerutti"]],
	"pelota parada": [["ROS", "Di María"], ["ARG", "Mancuello"], ["IND", "Montiel"], ["LAN", "Moreno"], ["VEL", "Valdés"], ["BAR", "Tapia"], ["UNI", "Malcorra", "+"]],
	habilidoso: [["BOC", "Paredes"], ["RIV", "Almada"], ["RAC", "Miljevic"], ["EST", "Sosa"], ["ARG", "López Muñoz"], ["GIM", "Fernández"], ["HUR", "Barticciotto"], ["TAL", "Cristaldo"], ["BEL", "Vázquez"], ["INS", "Luna"], ["ROS", "Di María"]],
	pase: [["BOC", "Paredes", "+"], ["VEL", "Valdés"], ["GIM", "Fernández"], ["RIV", "Almada"], ["ROS", "Campaz"], ["HUR", "Romero"], ["BEL", "Vázquez"], ["INR", "Atencio"], ["LAN", "Sepúlveda"]],
	cerebro: [["VEL", "Robertone"], ["EST", "Neves"], ["GIM", "Barros Schelotto", "Nicolás"], ["ERC", "Cabrera"], ["UNI", "Menossi"], ["BAR", "Rolón"], ["BOC", "Paredes", "+"], ["GIM", "Fernández"], ["TAL", "Fattori", "+"], ["VEL", "Aliendro", "+"]],
	centrador: [["RIV", "Montiel"], ["RIV", "Acuña"], ["VEL", "Gómez"], ["EST", "Benedetti"], ["EST", "Meza"], ["ROS", "Di María"], ["GIM", "Steimbach"], ["LAN", "Salvio"], ["ERC", "Alanís"], ["BAR", "Insúa", "Rodrigo"]],
	recuperador: [["BOC", "Ascacíbar"], ["BOC", "Paredes"], ["SLO", "Hernández"], ["EST", "Palacios", "Tomás"], ["EST", "Rojo"], ["ROS", "Ibarra"], ["INR", "Studer"], ["GIM", "Barros Schelotto", "Nicolás"], ["LAN", "Canale"], ["HUR", "Pereyra"], ["BEL", "Longo"], ["INS", "Abregú"], ["ERC", "Rosané"], ["ERC", "Cabrera"], ["BAR", "Gordillo"], ["IND", "Marcone"], ["LAN", "Guidara"], ["TAL", "Fattori", "+"]],
	potente: [["BOC", "Giménez"], ["RAC", "Martínez", "Adrián"], ["IND", "Ávila"], ["SLO", "Arboleda"], ["EST", "Gaich"], ["INR", "Costa"], ["INR", "Arce"], ["LAN", "Izquierdoz"], ["LAN", "Wlk"], ["RIE", "Quintana"], ["RIE", "Murillo"], ["HUR", "Nervo"], ["HUR", "Caicedo"], ["BEL", "Morales"], ["BAR", "Jappert"], ["BAR", "Rak"], ["BAR", "Tobio"], ["BAR", "Bruera"], ["EST", "Carrillo"], ["SLO", "Herazo", "+"]],
	pulmon: [["RIV", "Portillo"], ["RIV", "Arambarri"], ["SLO", "Tripichio"], ["EST", "Piovi"], ["ROS", "Ibarra"], ["ROS", "Copetti"], ["ARG", "Oroz"], ["INR", "Florentín"], ["GIM", "Steimbach"], ["GIM", "Miramón"], ["LAN", "Marcich"], ["RIE", "Céliz"], ["TAL", "Catalán"], ["TAL", "Schott"], ["INS", "Cerato"], ["NOB", "Solari"], ["ERC", "Cabrera"], ["ERC", "Talpone"], ["BOC", "Ascacíbar"], ["HUR", "Gil", "+"], ["RIE", "Goitía"], ["RIV", "Galván"]],
	tactico: [["BOC", "Pellegrino"], ["IND", "Arias"], ["EST", "González Pírez"], ["LAN", "Izquierdoz"], ["RIE", "Quintana"], ["HUR", "Blondel"], ["TAL", "Catalán"], ["INS", "Galván"], ["NOB", "Giannetti"], ["BOC", "Figal"], ["BOC", "Blanco"]],
	reflejos: [["RAC", "Cambeses"], ["EST", "Muslera"], ["VEL", "Marchiori"], ["NOB", "Arias"]],
	achique: [["IND", "Rey"], ["HUR", "Galíndez"], ["BOC", "Montero"]],
	pies: [["IND", "Mele"], ["RIE", "Arce"]],
	lento: [["BOC", "Paredes"], ["BEL", "Vázquez"], ["EST", "Carrillo"], ["GIM", "Fernández", "+"], ["IND", "Rey"], ["IND", "Marcone"], ["IND", "Ávila"], ["RAC", "Kranevitter"], ["ROS", "Fernández", "Pol"], ["TAL", "Fattori", "+"], ["UNI", "Menossi"], ["UNI", "Malcorra"], ["VEL", "Aliendro"], ["EST", "Sosa"]],
	erratico: [["BAR", "Orsini"], ["BOC", "Merentiel"], ["BOC", "Valencia", "+"], ["NOB", "Mazzantti"], ["ROS", "Copetti", "+"]],
	morfon: [["BEL", "Passerini"], ["BOC", "Romero"], ["RAC", "Martínez"]],
	"sin aire": [["BOC", "Paredes"], ["EST", "Rojo"]],
	patadura: [["ERC", "Bruera"], ["EST", "Carrillo"], ["HUR", "Gil"], ["ROS", "Copetti"], ["UNI", "Tarragona"]],
	inseguro: [["EST", "Muslera"], ["RIE", "Arce"]],
	desordenado: [["EST", "González Pírez"], ["EST", "Rodríguez"], ["HUR", "Gil"], ["RIV", "Martínez Quarta"]],
	faltero: [["EST", "Rojo", "+"], ["RIV", "Otamendi"], ["RIV", "Moreno"], ["GIM", "Miramón"], ["HUR", "Ibáñez"], ["HUR", "Caicedo"], ["LAN", "Carrera"]],
	liviano: [["EST", "Cetré"], ["RIV", "Driussi"], ["SLO", "Barrios", "+"], ["UNI", "Menossi"], ["VEL", "Marchiori"], ["VEL", "Martínez"]],
	"flojo de arriba": [["RIV", "Driussi"], ["ROS", "Ibarra"], ["SLO", "Farías"], ["SLO", "Barrios", "+"]],
	estatico: [["NOB", "Arias"], ["UNI", "Gomes Gerth"]],
};

const aplicar = process.argv.includes("--aplicar");
const dir = new URL("../../data/argentina/planteles/", import.meta.url);
const archivos = readdirSync(dir).filter((f) => f.endsWith(".json")).map((f) => {
	const texto = readFileSync(new URL(f, dir), "utf8");
	return { f, texto, d: JSON.parse(texto) };
});
const nuevos = new Map<any, string[]>();
for (const [rasgo, xs] of Object.entries(LISTA)) {
	for (const [equipo, apellido, ...extras] of xs) {
		const mas = extras.includes("+");
		const nombre = extras.find((e) => e !== "+");
		const a = archivos.find((x) => x.d.equipo === equipo);
		if (!a) throw new Error(`No existe el plantel ${equipo}`);
		const m = a.d.jugadores.filter((j: any) => (j.apellido === apellido || (!j.apellido && j.nombre === apellido)) && (!nombre || j.nombre === nombre) && !j.prospecto);
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
