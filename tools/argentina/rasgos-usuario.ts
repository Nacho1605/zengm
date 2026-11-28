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
	goleador: [["BOC", "Merentiel"], ["RAC", "Martínez", "Adrián"], ["VEL", "Martínez", "Ronaldo"], ["EST", "Alario"], ["INR", "Arce", "+"], ["HUR", "Pussetto"], ["BEL", "Fernández"], ["BEL", "Passerini"], ["BOC", "Bareiro"], ["GIM", "Torres", "Franco"], ["TAL", "Álvarez"], ["DYJ", "Fernández", "Leandro"], ["TIG", "Russo"], ["SAR", "Herrera"]],
	"larga distancia": [["VEL", "Lanzini"], ["BEL", "González Metilli", "+"], ["INS", "Luna"], ["NOB", "Soñora"], ["ERC", "Alanís"], ["UNI", "Pittón"], ["BAR", "Insúa", "Rodrigo"], ["BOC", "Paredes"], ["RIV", "Moreno"], ["PLA", "Zapiola"], ["BAN", "Gómez"]],
	aereo: [["EST", "Palacios", "Tomás"], ["EST", "Rojo"], ["EST", "Gaich"], ["BOC", "Di Lollo"], ["RIV", "Otamendi"], ["ARG", "Álvarez"], ["INR", "Arce"], ["LAN", "Canale"], ["ARG", "Molina"], ["SLO", "Auzmendi"], ["HUR", "Caicedo"], ["BEL", "López"], ["INS", "Alarcón"], ["ERC", "Maffini"], ["UNI", "Estigarribia"], ["BAR", "Jappert"], ["BAR", "Campi"], ["BAR", "Bruera"], ["BOC", "Valencia", "+"], ["EST", "Carrillo", "+"], ["GIM", "Conti"], ["RAC", "Martínez"], ["VEL", "Martínez", "+"], ["PLA", "Cuesta"], ["PLA", "Sepúlveda"], ["BAN", "Paz"], ["BAN", "Balboa"], ["BAN", "Anselmo"], ["TIG", "Barrionuevo"], ["TIG", "Álvarez"], ["TIG", "Oviedo"], ["SAR", "Marabel"], ["ALD", "Vombergar"]],
	gambeta: [["BOC", "Flores"], ["RIV", "Almada"], ["RAC", "Zaracho"], ["SLO", "Farías"], ["EST", "Cetré"], ["EST", "Correa"], ["ROS", "Campaz"], ["ROS", "Di María"], ["ARG", "López Muñoz", "+"], ["LAN", "Moreno"], ["IND", "Montiel"], ["RAC", "Díaz"], ["TAL", "Rick"], ["BEL", "Zelarayán", "Lucas"], ["BOC", "Romero"], ["INR", "Fernández"], ["RIV", "Correa"], ["RIV", "Driussi"], ["UNI", "Malcorra"], ["PLA", "Gauto"], ["DYJ", "Gutiérrez"], ["TIG", "López"], ["RIV", "Andrada", "Tobías"], ["SAR", "Mavilla"], ["SAR", "Rentería"]],
	veloz: [["BOC", "Villa", "+"], ["RAC", "Vergara"], ["EST", "Cetré"], ["SLO", "Cuello"], ["TAL", "Rick"], ["TAL", "Valoyes"], ["INS", "Córdoba"], ["NOB", "Mazzantti", "+"], ["EST", "Meza", "+"], ["SLO", "Barrios", "+"], ["SLO", "Cerutti"], ["TIG", "Subiabre"], ["ALD", "Godoy"]],
	"pelota parada": [["ROS", "Di María"], ["ARG", "Mancuello"], ["IND", "Montiel"], ["LAN", "Moreno"], ["VEL", "Valdés"], ["BAR", "Tapia"], ["UNI", "Malcorra", "+"], ["DYJ", "Barbona"], ["BAN", "Rodríguez", "Diego"]],
	habilidoso: [["BOC", "Paredes"], ["RIV", "Almada"], ["RAC", "Miljevic"], ["EST", "Sosa"], ["ARG", "López Muñoz"], ["GIM", "Fernández"], ["HUR", "Barticciotto"], ["TAL", "Cristaldo"], ["BEL", "Vázquez"], ["INS", "Luna"], ["ROS", "Di María"], ["PLA", "Merlini"], ["DYJ", "Barbona"], ["TIG", "Martínez"], ["ALD", "Gaitán"]],
	pase: [["BOC", "Paredes", "+"], ["VEL", "Valdés"], ["GIM", "Fernández"], ["RIV", "Almada"], ["ROS", "Campaz"], ["HUR", "Romero"], ["BEL", "Vázquez"], ["INR", "Atencio"], ["LAN", "Sepúlveda"], ["DYJ", "Molinas"], ["SAR", "Martínez"]],
	cerebro: [["VEL", "Robertone"], ["EST", "Neves"], ["GIM", "Barros Schelotto", "Nicolás"], ["ERC", "Cabrera"], ["UNI", "Menossi"], ["BAR", "Rolón"], ["BOC", "Paredes", "+"], ["GIM", "Fernández"], ["TAL", "Fattori", "+"], ["VEL", "Aliendro", "+"], ["DYJ", "Molinas"], ["TIG", "Saralegui"], ["ALD", "Castro"]],
	centrador: [["RIV", "Montiel"], ["RIV", "Acuña"], ["VEL", "Gómez"], ["EST", "Benedetti"], ["ROS", "Di María"], ["GIM", "Steimbach"], ["LAN", "Salvio"], ["PLA", "Togni"]],
	recuperador: [["BOC", "Ascacíbar"], ["BOC", "Paredes"], ["SLO", "Hernández"], ["EST", "Palacios", "Tomás"], ["EST", "Rojo"], ["ROS", "Ibarra"], ["INR", "Studer"], ["GIM", "Barros Schelotto", "Nicolás"], ["LAN", "Canale"], ["HUR", "Pereyra"], ["BEL", "Longo"], ["INS", "Abregú"], ["ERC", "Rosané"], ["ERC", "Cabrera"], ["BAR", "Gordillo"], ["IND", "Marcone"], ["LAN", "Guidara"], ["TAL", "Fattori", "+"], ["PLA", "Cuesta"], ["DYJ", "López"], ["TIG", "Leyes"], ["ALD", "Linares"]],
	potente: [["BOC", "Giménez"], ["RAC", "Martínez", "Adrián"], ["IND", "Ávila"], ["SLO", "Arboleda"], ["EST", "Gaich"], ["INR", "Costa"], ["INR", "Arce"], ["LAN", "Izquierdoz"], ["LAN", "Wlk"], ["RIE", "Quintana"], ["RIE", "Murillo"], ["HUR", "Nervo"], ["HUR", "Caicedo"], ["BEL", "Morales"], ["BAR", "Jappert"], ["BAR", "Rak"], ["BAR", "Tobio"], ["BAR", "Bruera"], ["EST", "Carrillo"], ["SLO", "Herazo", "+"], ["BAN", "Balboa"], ["TIG", "Laso"], ["SAR", "Insaurralde"], ["ALD", "Vombergar"]],
	pulmon: [["RIV", "Portillo"], ["RIV", "Arambarri"], ["SLO", "Tripichio"], ["EST", "Piovi"], ["ROS", "Ibarra"], ["ROS", "Copetti"], ["ARG", "Oroz"], ["INR", "Florentín"], ["GIM", "Steimbach"], ["GIM", "Miramón"], ["LAN", "Marcich"], ["RIE", "Céliz"], ["TAL", "Catalán"], ["TAL", "Schott"], ["INS", "Cerato"], ["NOB", "Solari"], ["ERC", "Cabrera"], ["ERC", "Talpone"], ["BOC", "Ascacíbar", "+"], ["HUR", "Gil", "+"], ["RIE", "Goitía"], ["RIV", "Galván"], ["PLA", "Gómez"], ["PLA", "Mainero"], ["DYJ", "Pérez", "César"], ["BAN", "Adoryán"], ["SAR", "Zabala"]],
	tactico: [["BOC", "Pellegrino"], ["IND", "Arias"], ["EST", "González Pírez"], ["LAN", "Izquierdoz"], ["RIE", "Quintana"], ["HUR", "Blondel"], ["TAL", "Catalán"], ["INS", "Galván"], ["NOB", "Giannetti"], ["BOC", "Figal"], ["BOC", "Blanco"], ["PLA", "Vázquez"], ["DYJ", "Martínez"], ["TIG", "Laso"], ["ALD", "Sigali"]],
	// Lateral o volante que pisa el área (rasgo nuevo del 25/11/2026)
	llegada: [["INS", "Sosa"], ["INS", "Cerato"], ["BAR", "Insúa", "Rodrigo"], ["BOC", "Ascacíbar"], ["ERC", "Alanís"], ["EST", "Castro"], ["EST", "Meza"], ["GIM", "Steimbach"], ["INR", "Florentín", "+"], ["INR", "Bucca"], ["RIV", "Acuña"], ["RIV", "Andrada", "Tobías"], ["TAL", "Galarza"], ["TAL", "Schott"], ["UNI", "Cuello"], ["UNI", "Pittón"], ["SAR", "Santamaría"]],
	reflejos: [["RAC", "Cambeses"], ["EST", "Muslera"], ["VEL", "Marchiori"], ["NOB", "Arias"], ["PLA", "Cozzani"], ["BAN", "Rodríguez", "Diego"], ["TIG", "Zenobio"], ["SAR", "Ayala"]],
	achique: [["IND", "Rey"], ["HUR", "Galíndez"], ["BOC", "Montero"]],
	pies: [["IND", "Mele"], ["RIE", "Arce"], ["BAN", "Rodríguez", "Diego", "+"]],
	lento: [["BOC", "Paredes"], ["BEL", "Vázquez"], ["EST", "Carrillo"], ["GIM", "Fernández", "+"], ["IND", "Rey"], ["IND", "Marcone"], ["IND", "Ávila"], ["RAC", "Kranevitter"], ["ROS", "Fernández", "Pol"], ["TAL", "Fattori", "+"], ["UNI", "Menossi"], ["UNI", "Malcorra"], ["VEL", "Aliendro"], ["EST", "Sosa"], ["SAR", "Insaurralde"], ["ALD", "Castro"], ["ALD", "Chávez", "Andrés"]],
	erratico: [["BAR", "Orsini"], ["BOC", "Merentiel"], ["BOC", "Valencia", "+"], ["NOB", "Mazzantti"], ["ROS", "Copetti", "+"], ["DYJ", "Hausch"], ["BAN", "Piñero"], ["BAN", "Balboa"], ["BAN", "Anselmo"], ["TIG", "Oviedo"], ["ALD", "Godoy"], ["ALD", "Cordero"]],
	morfon: [["BEL", "Passerini"], ["BOC", "Romero"], ["RAC", "Martínez"], ["PLA", "Gauto"], ["PLA", "López", "Nicolás"], ["DYJ", "Fernández", "Leandro"]],
	"sin aire": [["BOC", "Paredes"], ["EST", "Rojo"], ["DYJ", "Barbona"], ["DYJ", "Fernández", "Leandro"], ["BAN", "Zalazar"], ["TIG", "Martínez"], ["ALD", "Castro"], ["ALD", "Gaitán"], ["ALD", "Chávez", "Andrés"]],
	patadura: [["ERC", "Bruera"], ["EST", "Carrillo"], ["HUR", "Gil"], ["ROS", "Copetti"], ["UNI", "Tarragona"], ["PLA", "Goñi"], ["PLA", "Sepúlveda"], ["SAR", "Orihuela"]],
	inseguro: [["EST", "Muslera"], ["RIE", "Arce"], ["BAN", "Rodríguez", "Diego"]],
	desordenado: [["EST", "González Pírez"], ["EST", "Rodríguez"], ["HUR", "Gil"], ["RIV", "Martínez Quarta"], ["DYJ", "Portillo"]],
	faltero: [["EST", "Rojo", "+"], ["RIV", "Otamendi"], ["RIV", "Moreno"], ["GIM", "Miramón"], ["HUR", "Ibáñez"], ["HUR", "Caicedo"], ["LAN", "Carrera"], ["DYJ", "Fernández", "Damián"], ["DYJ", "López"], ["BAN", "Adoryán"], ["SAR", "Insaurralde", "+"], ["ALD", "Bochi"], ["ALD", "García"]],
	liviano: [["EST", "Cetré"], ["RIV", "Driussi"], ["SLO", "Barrios", "+"], ["UNI", "Menossi"], ["VEL", "Marchiori"], ["VEL", "Martínez"], ["PLA", "Zapiola"], ["PLA", "Merlini"], ["PLA", "Gauto"], ["DYJ", "Barbona"], ["TIG", "Serrago"], ["TIG", "López"], ["SAR", "Giménez", "Elián"], ["SAR", "González"], ["SAR", "Contrera"]],
	"flojo de arriba": [["RIV", "Driussi"], ["ROS", "Ibarra"], ["SLO", "Farías"], ["SLO", "Barrios", "+"], ["PLA", "Gómez"], ["DYJ", "Molinas"], ["DYJ", "Blanco"], ["DYJ", "Hausch"], ["SAR", "García"], ["ALD", "Rodríguez"]],
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
