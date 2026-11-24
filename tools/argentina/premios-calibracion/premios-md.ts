// Genera data/argentina/premios.md desde premios.ts (texto de cada premio en QUE).
// Uso: node tools/argentina/premios-calibracion/premios-md.ts; después se le
// agrega la tabla de comparar.ts si hay una liga simulada.
import { writeFileSync } from "node:fs";
import { PREMIOS, PESOS, PRESTIGIO } from "../premios.ts";
const QUE: Record<string, string> = {
	BDO: "El mejor jugador de la temporada (cuenta como MVP para el juego). Rendimiento según el puesto, cuánto jugó y cuánto ganó su equipo; los puestos de ataque pesan más.",
	ZPOY: "El mejor de cada zona, con la fórmula del Ballon d'Or: dos ganadores. El juego le antepone la zona: \"Metropolitano Player of the Year\" y \"Federal Player of the Year\".",
	"Golden Boot": "El goleador: los puntos del motor en toda la temporada, con un plus por la eficacia.",
	PMK: "El asistidor: asistencias de toda la temporada, con un plus por el porcentaje de jugadas que asiste y un descuento por pérdidas.",
	"Golden Glove": "El mejor arquero (solo arqueros): defensa, atajadas (tapones), rebotes y robos, minutos y victorias.",
	DPOY: "El mejor defensor, sin arqueros: centrales, laterales (+12%) y pivotes (−25%), por defensa, titularidad y victorias.",
	ROY: "La revelación (solo novatos; cuenta como ROY): como el Ballon d'Or, con menos minutos exigidos y el arquero con 55% menos de peso.",
	SUB: "El mejor suplente (titular en menos de la mitad de sus partidos): rendimiento, con 20 partidos y 900 minutos para sumar completo. Sin arqueros; defensores con un poco menos de peso.",
	MIP: "El que más mejoró su nivel contra la temporada anterior (PER y BPM); los minutos solo cuentan hasta 600', así pasar de suplente a titular no es \"progreso\".",
	STR: "El mejor delantero centro.",
	WNG: "El mejor extremo.",
	N10: "El mejor mediapunta (el diez).",
	MID: "El mejor del medio: pivotes (+5%) y volantes.",
	FB: "El mejor lateral.",
	CB: "El mejor central (#2 y #6).",
	LMVP: "El mejor de la liguilla: rendimiento, cuántos partidos jugó (llegar lejos suma) y minutos por partido. Arquero y centrales, con menos peso.",
	FMVP: "La figura de la final: puntaje del partido, robos, tapones y asistencias; vale casi el doble si ganó; 45 minutos para sumar completo. Arquero (−60%) y centrales (−20%), con menos peso: sus rebotes inflan el puntaje.",
	"TOTS-D": "Los 5 mejores de la defensa: centrales y laterales (+50%: en el motor sacan entre 60% y 66% de lo de un central).",
	"TOTS-M": "Los 5 mejores del medio: pivotes, volantes (+5%) y mediapuntas (−45%: en el motor sacan ~1,75 veces lo de un pivote).",
	"TOTS-A": "Los 5 mejores del ataque: extremos y delanteros (+20%).",
	"All-Rookie": "Los 5 mejores novatos, con la fórmula de la revelación.",
};
let t = `# Premios de la liga (gala; versión final por ahora, v2.24.7)\n\nGenerado desde \`tools/argentina/premios.ts\`. Las estadísticas son del motor (básquet por dentro) y por partido; "gp" = partidos, "min" = minutos por partido, "winp" = % de victorias del equipo, "seasonFraction" = parte de la temporada que jugó. Ninguna fórmula usa las WS (ver \`analisis-premios.md\`).\n\nPeso de ataque y defensa por puesto: ${Object.entries(PESOS).map(([p, [o, d]]) => `${p} ${o}/${d}`).join(", ")}. Peso del puesto en los premios generales: ${Object.entries(PRESTIGIO).map(([p, v]) => `${p} ${v}`).join(", ")}.\n\n`;
for (const a of PREMIOS as any[]) {
	t += `## ${a.name} (${a.shortName})\n\n${QUE[a.shortName]}\n\n`;
	const extra = [a.numTeams ? `equipo de 5` : "", a.rookie ? "solo novatos" : "", a.bench ? "solo suplentes" : "", a.mip ? "mejora contra el año anterior" : "", a.statRange === "playoffs" ? "solo playoffs" : a.statRange === -1 ? "la final" : a.statRange === -2 ? "las semifinales" : "", a.actAs ? `cuenta como ${a.actAs.toUpperCase()} para el juego` : ""].filter(Boolean);
	if (extra.length) t += `Condiciones: ${extra.join("; ")}.\n\n`;
	if (a.formulaByPos) {
		const grupos = new Map<string, string[]>();
		for (const [p, f] of Object.entries(a.formulaByPos)) grupos.set(f as string, [...(grupos.get(f as string) ?? []), p]);
		for (const [f, ps] of grupos) t += `- ${ps.join(", ")}: \`${f}\`${f.startsWith("-1000") ? " (no participan)" : ""}\n`;
		t += "\n";
	} else t += `\`${a.formula}\`\n\n`;
}
writeFileSync(new URL("../../../data/argentina/premios.md", import.meta.url), t);
console.log(t.length);
