// Auditoría completa de un archivo de liga de BBGM Argentina. Uso:
//
//   node tools/argentina/auditar.ts ARCHIVO.json [RAIZ_DEL_JUEGO_OFICIAL]
//
// Revisa la configuración, los equipos, las selecciones de draft y todos los
// jugadores contra las reglas del juego y las normas del proyecto. Imprime cada
// control con OK o ALERTA, y al final un resumen.

import { readFileSync } from "node:fs";

const [file, oficial = new URL("../..", import.meta.url).pathname] =
	process.argv.slice(2);
if (!file) {
	throw new Error("Uso: node auditar.ts ARCHIVO.json [RAIZ_DEL_JUEGO]");
}
const L = JSON.parse(readFileSync(file, "utf8"));
const ga = L.gameAttributes;
const SEASON: number = ga.season;
const T: any[] = L.teams;
const P: any[] = L.players;

const alertas: string[] = [];
let controles = 0;
const control = (titulo: string, problemas: string[], detalle = "") => {
	controles += 1;
	if (problemas.length === 0) {
		console.log(`  OK      ${titulo}${detalle ? ` (${detalle})` : ""}`);
	} else {
		console.log(
			`  ALERTA  ${titulo}: ${problemas.length}${detalle ? ` (${detalle})` : ""}`,
		);
		for (const p of problemas.slice(0, 8)) {
			console.log(`            - ${p}`);
		}
		if (problemas.length > 8) {
			console.log(`            … y ${problemas.length - 8} más`);
		}
		alertas.push(`${titulo} (${problemas.length})`);
	}
};
const valor = (v: any) =>
	Array.isArray(v) && v[0]?.start !== undefined ? v.at(-1).value : v;
const cuenta = (xs: any[], f: (x: any) => any) =>
	xs.reduce((m: Record<string, number>, x) => {
		const k = f(x);
		m[k] = (m[k] ?? 0) + 1;
		return m;
	}, {});

// OVR oficial (src/worker/core/player/ovr.basketball.ts)
const W: Record<string, [number, number]> = {
	hgt: [0.159, 47.5],
	stre: [0.0777, 50.2],
	spd: [0.123, 50.8],
	jmp: [0.051, 48.7],
	endu: [0.0632, 39.9],
	ins: [0.0126, 42.4],
	dnk: [0.0286, 49.5],
	ft: [0.0202, 47.0],
	tp: [0.0726, 47.1],
	oiq: [0.133, 46.8],
	diq: [0.159, 46.7],
	drb: [0.059, 54.8],
	pss: [0.062, 51.3],
	fg: [0.01, 47.0],
	reb: [0.01, 51.4],
};
const KEYS = Object.keys(W);
const ovr = (r: any) => {
	let x = 48.5;
	for (const k of KEYS) {
		x += W[k]![0] * (r[k] - W[k]![1]);
	}
	let f;
	if (x >= 68) {
		f = 8;
	} else if (x >= 50) {
		f = 4 + ((x - 50) * 4) / 18;
	} else if (x >= 42) {
		f = -5 + ((x - 42) * 9) / 8;
	} else if (x >= 31) {
		f = -5 - ((42 - x) * 5) / 11;
	} else {
		f = -10;
	}
	return Math.min(100, Math.max(0, Math.round(x + f)));
};

const activos = T.filter((t) => !t.disabled);
const tidsActivos = new Set(activos.map((t) => t.tid));
const tidsTodos = new Set(T.map((t) => t.tid));
const abbrev = (tid: number) =>
	T.find((t) => t.tid === tid)?.abbrev ??
	({ "-1": "libre", "-2": "prospecto", "-3": "retirado" } as any)[tid] ??
	String(tid);
const nombre = (p: any) =>
	`${p.firstName} ${p.lastName} (${abbrev(p.tid)}, ${p.born?.year})`;

// ---------------------------------------------------------------- Liga
console.log(`\nLIGA (${L.meta?.name ?? "-"}, versión ${L.version})`);
control(
	"Temporada y fase",
	[
		...(SEASON !== 2026 ? [`temporada ${SEASON}`] : []),
		...(ga.phase !== 0 ? [`fase ${ga.phase}`] : []),
		...(ga.startingSeason !== SEASON ? ["startingSeason distinta"] : []),
	],
	`${SEASON}, pretemporada`,
);
const divs = valor(ga.divs) as any[];
const confs = valor(ga.confs) as any[];
control(
	"Zonas y divisiones de los equipos",
	T.filter(
		(t) =>
			!divs.some((d) => d.did === t.did && d.cid === t.cid) ||
			!confs.some((c) => c.cid === t.cid),
	).map((t) => `${t.abbrev}: cid ${t.cid}, did ${t.did}`),
	`${confs.length} zonas, ${divs.length} divisiones`,
);
const porZona = cuenta(activos, (t) => t.cid);
control(
	"Activos por zona (el fixture necesita zonas iguales)",
	Object.values(porZona).every((n) => n === Object.values(porZona)[0])
		? []
		: [JSON.stringify(porZona)],
	JSON.stringify(porZona),
);
const numGames = valor(ga.numGames);
const numGamesConf = valor(ga.numGamesConf);
control(
	"Fixture",
	[
		...(numGamesConf !== null &&
		numGamesConf !== (Object.values(porZona)[0]! - 1) * 2
			? [`numGamesConf ${numGamesConf}`]
			: []),
		...(numGamesConf !== null && numGamesConf > numGames
			? ["numGamesConf > numGames"]
			: []),
		...(valor(ga.numGamesDiv) !== null ? ["numGamesDiv no es null"] : []),
	],
	`${numGames} partidos, ${numGamesConf} de zona`,
);
const series = valor(ga.numGamesPlayoffSeries) as number[];
const playoffTeams = 2 ** series.length - (valor(ga.numPlayoffByes) ?? 0);
control(
	"Playoffs",
	playoffTeams > activos.length ? [`${playoffTeams} clasificados`] : [],
	`${playoffTeams} clasificados, series ${JSON.stringify(series)}, por zona: ${valor(ga.playoffsByConf)}`,
);
const lotteryTeams = activos.length - playoffTeams;
control(
	"Lotería del draft",
	ga.draftType === "nba2019" &&
		ga.draftLotteryCustomChances?.length !== lotteryTeams
		? [
				`${ga.draftLotteryCustomChances?.length} probabilidades para ${lotteryTeams} equipos`,
			]
		: [],
	`${ga.draftType}, ${lotteryTeams} equipos en la lotería, ${ga.numDraftRounds} ronda`,
);
control(
	"Economía",
	[
		...(ga.minContract >= ga.maxContract ? ["mínimo ≥ máximo"] : []),
		...(ga.minPayroll >= ga.salaryCap ? ["planilla mínima ≥ tope"] : []),
		...(ga.luxuryPayroll < ga.salaryCap ? ["lujo < tope"] : []),
		...(ga.minContract * ga.maxRosterSize > ga.salaryCap
			? ["un plantel lleno de sueldos mínimos no entra en el tope"]
			: []),
	],
	`contratos $${ga.minContract / 1000}M–$${ga.maxContract / 1000}M, tope ${ga.salaryCapType} $${ga.salaryCap / 1000}M, lujo $${ga.luxuryPayroll / 1000}M (x${ga.luxuryTax}), mínimo $${ga.minPayroll / 1000}M`,
);
control(
	"Planteles",
	ga.minRosterSize > ga.maxRosterSize ||
		ga.minRosterSize < valor(ga.numPlayersOnCourt)
		? ["mínimo inválido"]
		: [],
	`${ga.minRosterSize}–${ga.maxRosterSize}, ${valor(ga.numPlayersOnCourt)} en cancha`,
);
control(
	"Partido",
	[
		...(valor(ga.numPeriods) !== 2 ? ["no son 2 tiempos"] : []),
		...(valor(ga.quarterLength) !== 45 ? ["los tiempos no son de 45"] : []),
		...(valor(ga.maxOvertimes) !== 0 ? ["hay alargue en la fase regular"] : []),
		...(valor(ga.pointsFormula) !== "3*W+T" ? ["puntos no son 3*G+E"] : []),
	],
	`2x45, empate posible, ${valor(ga.pointsFormula)}, alargue de playoffs ${ga.overtimeLengthPlayoffs}' + ${ga.shootoutRoundsPlayoffs} penales, local +${ga.homeCourtAdvantage}%`,
);
const lesiones = (ga.injuries ?? []) as any[];
control(
	"Lesiones",
	lesiones
		.filter((i) => !(i.frequency > 0) || !(i.games >= 0) || !i.name)
		.map((i) => i.name),
	`${lesiones.length} tipos, ritmo ${ga.injuryRate}`,
);
const premios = (ga.awards ?? []) as any[];
control(
	"Premios",
	premios.filter((a) => !a.name || !a.formula).map((a) => JSON.stringify(a)),
	`${premios.length} premios en español`,
);
control(
	"Partido de las Estrellas",
	ga.allStarGame === null ? ["desactivado"] : [],
	`al ${ga.allStarGame}, ${ga.allStarNum} por equipo, ${ga.allStarType}, volcadas ${ga.allStarDunk}, triples ${ga.allStarThree}`,
);
const user = valor(ga.userTid);
control(
	"Equipo del usuario",
	tidsActivos.has(user) ? [] : [`tid ${user} no está activo`],
	abbrev(user),
);
const bio = ga.playerBioInfo;
control(
	"Biografías: frecuencias de países",
	Object.entries(bio?.frequencies ?? {})
		.filter(([, f]) => !((f as number) >= 0))
		.map(([c]) => c),
	`${Object.keys(bio?.frequencies ?? {}).length} países`,
);
console.log(
	`  INFO    muertes trágicas ${ga.tragicDeathRate}, cierre de pases ${ga.tradeDeadline}, traspasos IA x${ga.aiTradesFactor}, edades del draft ${JSON.stringify(ga.draftAges)}, contratos 1–${ga.maxContractLength} años, God Mode ${ga.godMode}`,
);

// ---------------------------------------------------------------- Equipos
console.log(`\nEQUIPOS (${T.length}: ${activos.length} activos)`);
const repetidos = (xs: any[]) =>
	xs.filter((x, i) => xs.indexOf(x) !== i).map(String);
control("tid únicos", repetidos(T.map((t) => t.tid)));
control("Abreviaturas únicas", repetidos(T.map((t) => t.abbrev)));
control(
	"Ciudad + apodo únicos",
	repetidos(T.map((t) => `${t.region} ${t.name}`)),
);
control(
	"Filas de temporada (activos con 2026, inactivos sin 2026)",
	T.filter(
		(t) =>
			(t.seasons ?? []).some((s: any) => s.season === SEASON) ===
			Boolean(t.disabled),
	).map((t) => t.abbrev),
);
control(
	"Colores (3, en hexadecimal)",
	T.filter(
		(t) =>
			t.colors?.length !== 3 ||
			t.colors.some((c: string) => !/^#[\dA-Fa-f]{6}$/.test(c)),
	).map((t) => `${t.abbrev} ${JSON.stringify(t.colors)}`),
);
control(
	"Camiseta válida",
	T.filter(
		(t) =>
			!["jersey", "jersey2", "jersey3", "jersey4", "jersey5"].includes(
				t.jersey,
			),
	).map((t) => `${t.abbrev} ${t.jersey}`),
);
control(
	"Logo",
	T.filter((t) => !t.imgURL).map((t) => t.abbrev),
	`${T.filter((t) => t.imgURL).length} con logo`,
);
control(
	"Logos con parámetros de rastreo (utm)",
	T.filter((t) => /utm_/.test(`${t.imgURL} ${t.imgURLSmall}`)).map(
		(t) => t.abbrev,
	),
);
control(
	"Población y estadio",
	T.filter((t) => !(t.pop > 0) || !(t.stadiumCapacity > 0)).map(
		(t) => `${t.abbrev} pop ${t.pop}, estadio ${t.stadiumCapacity}`,
	),
);
control(
	"Presupuestos (niveles de 1 a 100)",
	T.filter((t) =>
		["scouting", "coaching", "health", "facilities"].some(
			(k) => !(t.budget?.[k] >= 1 && t.budget?.[k] <= 100),
		),
	).map((t) => t.abbrev),
	`niveles: ${JSON.stringify(Object.keys(cuenta(T, (t) => t.budget?.coaching)))}`,
);
const hypes = activos.map(
	(t) => t.seasons.find((s: any) => s.season === SEASON)?.hype,
);
control(
	"Hype y estrategia de los activos",
	activos
		.filter(
			(t, i) =>
				!(hypes[i] >= 0 && hypes[i] <= 1) ||
				!["contending", "rebuilding"].includes(t.strategy),
		)
		.map((t) => t.abbrev),
	`hype ${Math.min(...hypes)}–${Math.max(...hypes)}, ${JSON.stringify(cuenta(activos, (t) => t.strategy))}`,
);

// ---------------------------------------------------------------- Picks
console.log(`\nSELECCIONES DE DRAFT (${L.draftPicks.length})`);
const dp: any[] = L.draftPicks;
control(
	"De equipos activos",
	dp
		.filter((d) => !tidsActivos.has(d.tid) || !tidsActivos.has(d.originalTid))
		.map((d) => `${d.season} ${abbrev(d.originalTid)}`),
);
const esperado = activos.length * ga.numDraftRounds;
const porAnio = cuenta(dp, (d) => d.season);
control(
	"Una por equipo y por año",
	Object.entries(porAnio)
		.filter(([, n]) => n !== esperado)
		.map(([s, n]) => `${s}: ${n}`),
	JSON.stringify(porAnio),
);
control("dpid únicos", repetidos(dp.map((d) => d.dpid)));

// ---------------------------------------------------------------- Jugadores
const porTid = cuenta(P, (p) => (p.tid >= 0 ? "equipo" : p.tid));
console.log(
	`\nJUGADORES (${P.length}: ${porTid.equipo} en equipos, ${porTid[-1]} libres, ${porTid[-2]} prospectos, ${porTid[-3]} retirados)`,
);
control("pid numérico y único", [
	...P.filter((p) => typeof p.pid !== "number").map(nombre),
	...repetidos(P.map((p) => p.pid)),
]);
control(
	"tid válido",
	P.filter((p) => p.tid >= 0 && !tidsActivos.has(p.tid)).map(nombre),
);
const POS = ["C", "FC", "PF", "GF", "G", "SG", "PG", "SF", "F"];
control(
	"Posición fija válida (y la misma en el último rating)",
	P.filter(
		(p) =>
			p.tid !== -3 && (!POS.includes(p.pos) || p.ratings.at(-1).pos !== p.pos),
	).map(nombre),
);
const vivos = P.filter((p) => p.tid !== -3);
control(
	"Ratings completos y entre 0 y 100",
	vivos
		.filter((p) =>
			KEYS.some((k) => {
				const v = p.ratings.at(-1)[k];
				return typeof v !== "number" || v < 0 || v > 100;
			}),
		)
		.map(nombre),
);
const ovrMal = vivos.filter(
	(p) => ovr(p.ratings.at(-1)) !== p.ratings.at(-1).ovr,
);
control(
	"OVR guardado = OVR oficial",
	ovrMal.map(
		(p) => `${nombre(p)}: ${p.ratings.at(-1).ovr} vs ${ovr(p.ratings.at(-1))}`,
	),
);
control(
	"Ratings de la temporada 2026 (activos y libres)",
	P.filter((p) => p.tid >= -1 && p.ratings.at(-1).season !== SEASON).map(
		nombre,
	),
);
control(
	"Altura y peso",
	vivos.filter((p) => !(p.hgt > 0) || !(p.weight > 0)).map(nombre),
);
const enEquipos = P.filter((p) => p.tid >= 0);
control(
	"Contrato vigente de los jugadores con equipo",
	enEquipos
		.filter((p) => {
			const c = p.contracts?.at(-1);
			return (
				!c ||
				c.endedEarly ||
				c.start > SEASON ||
				c.start + c.amounts.length - 1 < SEASON
			);
		})
		.map(nombre),
);
control(
	"Montos de contratos dentro de la escala",
	enEquipos
		.filter((p) =>
			p.contracts
				.at(-1)
				.amounts.some((a: number) => a < ga.minContract || a > ga.maxContract),
		)
		.map(nombre),
);
control(
	"Prospectos sin contrato",
	P.filter(
		(p) => p.tid === -2 && (p.contracts ?? []).some((c: any) => !c.endedEarly),
	).map(nombre),
);
const lesionados = vivos.filter((p) => p.injury?.gamesRemaining > 0);
control(
	"Lesiones actuales",
	vivos
		.filter(
			(p) =>
				!p.injury ||
				p.injury.gamesRemaining > 0 === (p.injury.type === "Healthy"),
		)
		.map(nombre),
	lesionados.map((p) => `${p.lastName} ${p.injury.gamesRemaining}`).join(", "),
);
const flags = new Set(
	[
		...readFileSync(
			`${oficial}/src/ui/components/CountryFlag.tsx`,
			"utf8",
		).matchAll(/^\t"?([^\n":]+?)"?: "[a-z-]+",$/gm),
	].map((m) => m[1]),
);
const pais = (p: any) =>
	String(p.born?.loc ?? "")
		.split(", ")
		.at(-1);
control(
	"País con bandera",
	[
		...new Set(
			vivos
				.filter((p) => !flags.has(pais(p)) && !bio?.countries?.[pais(p)]?.flag)
				.map((p) => pais(p)),
		),
	],
	`${new Set(vivos.map(pais)).size} países`,
);
control(
	"Draft: club existente y año no posterior a la temporada",
	vivos
		.filter(
			(p) =>
				(p.draft.round > 0 && !tidsTodos.has(p.draft.tid)) ||
				(p.tid !== -2 && p.draft.year > SEASON),
		)
		.map(nombre),
);
control(
	"Parientes que existen",
	P.flatMap((p) =>
		(p.relatives ?? [])
			.filter((r: any) => !P.some((q) => q.pid === r.pid))
			.map((r: any) => `${nombre(p)} → ${r.name}`),
	),
);
const camisetas: string[] = [];
for (const t of activos) {
	const nums = enEquipos
		.filter((p) => p.tid === t.tid)
		.map((p) => p.jerseyNumber)
		.filter(Boolean);
	for (const n of repetidos(nums)) {
		camisetas.push(`${t.abbrev} #${n}`);
	}
}
control("Camisetas repetidas en un equipo", camisetas);
const tamanos = activos.map((t) => [
	t.abbrev,
	enEquipos.filter((p) => p.tid === t.tid),
]);
control(
	"Planteles dentro del mínimo y del máximo",
	tamanos
		.filter(
			([, ps]: any) =>
				ps.length < ga.minRosterSize || ps.length > ga.maxRosterSize,
		)
		.map(([a, ps]: any) => `${a} ${ps.length}`),
);
control(
	"Al menos 2 arqueros por equipo",
	tamanos
		.filter(([, ps]: any) => ps.filter((p: any) => p.pos === "C").length < 2)
		.map(
			([a, ps]: any) => `${a} ${ps.filter((p: any) => p.pos === "C").length}`,
		),
);
control(
	"Arqueros sin tiro (ins, dnk, fg y tp ≤ 5)",
	vivos
		.filter(
			(p) =>
				p.pos === "C" &&
				["ins", "dnk", "fg", "tp"].some((k) => p.ratings.at(-1)[k] > 5),
		)
		.map(nombre),
);
const hgtMal = vivos.filter(
	(p) =>
		Math.abs(
			p.ratings.at(-1).hgt -
				Math.max(
					0,
					Math.min(100, Math.round(((p.hgt * 2.54 - 156) * 100) / 44)),
				),
		) > 3,
);
control("Rating de altura según la regla de tres (±3)", hgtMal.map(nombre));
const edades = enEquipos.map((p) => SEASON - p.born.year);
control(
	"Edades (15 a 40 en equipos)",
	enEquipos
		.filter((p) => SEASON - p.born.year > 40 || SEASON - p.born.year < 15)
		.map(nombre),
	`de ${Math.min(...edades)} a ${Math.max(...edades)}`,
);
const sinFoto = enEquipos.filter((p) => !p.imgURL);
control(
	"Foto",
	sinFoto.map(nombre),
	`${enEquipos.length - sinFoto.length} de ${enEquipos.length} con foto`,
);
const homonimos = Object.entries(
	cuenta(
		vivos.filter((p) => p.tid !== -2),
		(p) =>
			`${p.firstName} ${p.lastName}`
				.normalize("NFD")
				.replace(/[̀-ͯ]/g, "")
				.toLowerCase(),
	),
).filter(([, n]) => n > 1);
control(
	"Mismo nombre en dos jugadores (no prospectos)",
	homonimos.map(([n]) => {
		const ps = vivos.filter(
			(p) =>
				p.tid !== -2 &&
				`${p.firstName} ${p.lastName}`
					.normalize("NFD")
					.replace(/[̀-ͯ]/g, "")
					.toLowerCase() === n,
		);
		return `${n}: ${ps.map((p) => `${abbrev(p.tid)} ${p.born.year}`).join(", ")}`;
	}),
);
const prospectos = P.filter((p) => p.tid === -2);
const porClase = cuenta(prospectos, (p) => p.draft.year);
const minimoClase = Math.round((ga.numDraftRounds * activos.length * 7) / 6);
control(
	`Clases de draft con al menos ${minimoClase} prospectos`,
	Object.entries(porClase)
		.filter(([, n]) => n < minimoClase)
		.map(([y, n]) => `${y}: ${n}`),
	`${Object.keys(porClase)[0]}–${Object.keys(porClase).at(-1)}, ${JSON.stringify([...new Set(Object.values(porClase))])} por clase`,
);
control(
	"Retirados: año de retiro no posterior a la temporada",
	P.filter((p) => p.tid === -3 && !(p.retiredYear <= SEASON)).map(nombre),
	`${P.filter((p) => p.tid === -3 && p.hof).length} en el Salón de la Fama`,
);
control(
	"Estadísticas de 2026 en blanco (pretemporada)",
	vivos
		.filter((p) =>
			(p.stats ?? []).some((s: any) => s.season === SEASON && s.gp > 0),
		)
		.map(nombre),
);

// ---------------------------------------------------------------- Resumen
console.log(
	`\nRESUMEN: ${controles} controles, ${alertas.length} con alertas${alertas.length ? `: ${alertas.join("; ")}` : ""}`,
);
