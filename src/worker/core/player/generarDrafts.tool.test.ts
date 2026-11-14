// Herramienta (no es una prueba): genera clases de draft futuras con jugadores
// coherentes con su posición, para escribirlas en el archivo de liga. Así el
// juego oficial no necesita generar prospectos al azar.
//
// Uso:
//   GENERAR_DRAFTS=1 LEAGUE_FILE=entrada.json OUT=prospectos.json \
//     DESDE=2026 HASTA=2055 npx vitest --run src/worker/core/player/generarDrafts.tool.test.ts
//
// Cada jugador tiene la posición fija y la norma de su posición (ver
// genRatingsFutbol.ts). El talento de cada posición se calibra para que el
// OVR oficial promedio coincida con el de los prospectos reales del archivo.

import { test } from "vitest";
// @ts-expect-error
import { readFileSync, writeFileSync } from "node:fs";
import { player } from "../index.ts";
import { g } from "../../util/index.ts";
import { resetG } from "../../../test/helpers.ts";
import { DEFAULT_LEVEL } from "../../../common/budgetLevels.ts";
import { mergeCountries } from "../../../common/names.ts";
import { groups } from "../../data/defaultCountries.ts";
import {
	FUTBOL_POSITION_PROFILES,
	TALENT_BY_POSITION,
} from "./genRatingsFutbol.ts";

const env = (globalThis as any).process?.env ?? {};

const pickWeighted = <T extends string>(weights: Record<T, number>): T => {
	const entries = Object.entries(weights) as [T, number][];
	let total = 0;
	for (const [, w] of entries) {
		total += w;
	}
	let rand = Math.random() * total;
	for (const [key, w] of entries) {
		rand -= w;
		if (rand <= 0) {
			return key;
		}
	}
	return entries.at(-1)![0];
};

test.skipIf(!env.GENERAR_DRAFTS)(
	"generar drafts",
	async () => {
		const league = JSON.parse(readFileSync(env.LEAGUE_FILE, "utf8"));
		const ga = league.gameAttributes;
		const desde = Number(env.DESDE);
		const hasta = Number(env.HASTA);
		// The game needs round(2 * active teams * 7 / 6) prospects per class, or
		// it adds random ones (65 with 28 teams, 70 with 30)
		const numActive = league.teams.filter((t: any) => !t.disabled).length;
		const porClase = Number(
			env.POR_CLASE ?? Math.round((2 * numActive * 7) / 6),
		);

		// Nombres: la configuración del archivo, sobre la lista real del juego
		const names = JSON.parse(readFileSync("data/names.json", "utf8"));
		const bio = ga.playerBioInfo;
		const countries = mergeCountries(
			bio,
			names.countries,
			names.groups,
			groups,
		) as any;
		const frequencies = bio.frequencies as Record<string, number>;
		const genName = () => {
			let country = pickWeighted(frequencies);
			if (!countries[country]?.first || !countries[country]?.last) {
				country = "Argentina";
			}
			const info = countries[country];
			const colleges = info.colleges ?? bio.default?.colleges;
			const skip =
				info.fractionSkipCollege ?? bio.default?.fractionSkipCollege ?? 1;
			const college =
				colleges && Object.keys(colleges).length > 0 && Math.random() > skip
					? pickWeighted(colleges)
					: "";
			const races = info.races ?? bio.default?.races ?? { white: 1 };
			return {
				country,
				firstName: pickWeighted(info.first),
				lastName: pickWeighted(info.last),
				college,
				race: pickWeighted(races) as any,
			};
		};

		// Prospectos reales del archivo: la meta de nivel y de edad
		const reales = league.players.filter((p: any) => p.tid === -2);
		const ovrMeta =
			reales.reduce((sum: number, p: any) => sum + p.ratings.at(-1).ovr, 0) /
			reales.length;

		resetG();
		for (const key of ["heightFactor", "weightFactor", "draftAges", "gender"]) {
			if (key in ga) {
				g.setWithoutSavingToDB(key as any, ga[key]);
			}
		}

		const genProspect = async (draftYear: number) => {
			// Generar con las normas del modo fútbol...
			const age = 17 + Math.floor(Math.random() * 3);
			g.setWithoutSavingToDB("season", draftYear - 2);
			g.setWithoutSavingToDB("numPlayersOnCourt", 11);
			const p: any = player.generate(
				-2,
				age,
				draftYear - 2,
				false,
				DEFAULT_LEVEL,
				genName(),
			);

			// ...y desarrollar con la fórmula de OVR oficial (5 en cancha)
			g.setWithoutSavingToDB("numPlayersOnCourt", 5);
			await player.develop(p, 2);
			const r = { ...p.ratings.at(-1), season: draftYear };
			// Goalkeepers reach the draft with no shooting skills at all
			if (p.pos === "C") {
				for (const key of ["ins", "dnk", "fg", "tp"]) {
					r[key] = Math.min(r[key], 5);
				}
			}
			p.ratings = [r];
			p.born.year = draftYear - (age + 2);
			g.setWithoutSavingToDB("season", draftYear);
			await player.develop(p, 0);
			p.draft = {
				...p.draft,
				year: draftYear,
				round: 0,
				pick: 0,
				tid: -1,
				originalTid: -1,
				ovr: p.ratings[0].ovr,
				pot: p.ratings[0].pot,
				skills: p.ratings[0].skills,
			};
			return p;
		};

		// Calibrar el talento de cada posición para el OVR oficial
		const log: string[] = [];
		for (let iter = 0; iter < 4; iter++) {
			const byPos: Record<string, number[]> = {};
			for (let i = 0; i < 1200; i++) {
				const p = await genProspect(desde);
				(byPos[p.pos] ??= []).push(p.ratings[0].ovr);
			}
			const line: string[] = [];
			for (const pos of Object.keys(FUTBOL_POSITION_PROFILES)) {
				const ovrs = byPos[pos] ?? [];
				const mean = ovrs.reduce((a, b) => a + b, 0) / ovrs.length;
				line.push(`${pos} ${mean.toFixed(1)}`);
				// About 35 ovr points per unit of mean factor
				TALENT_BY_POSITION[pos] =
					TALENT_BY_POSITION[pos]! + (ovrMeta - mean) / 35;
			}
			log.push(`iteración ${iter}: ${line.join(", ")}`);
		}
		log.push(
			`meta OVR ${ovrMeta.toFixed(1)}`,
			`talento: ${JSON.stringify(TALENT_BY_POSITION)}`,
		);

		// Generar las clases
		const prospects = [];
		for (let year = desde; year <= hasta; year++) {
			for (let i = 0; i < porClase; i++) {
				prospects.push(await genProspect(year));
			}
		}

		const byPos: Record<string, number[]> = {};
		for (const p of prospects) {
			(byPos[p.pos] ??= []).push(p.ratings[0].ovr);
		}
		log.push(
			`final: ${Object.entries(byPos)
				.map(
					([pos, ovrs]) =>
						`${pos} ${ovrs.length} jugadores, OVR ${(ovrs.reduce((a, b) => a + b, 0) / ovrs.length).toFixed(1)}`,
				)
				.join(" | ")}`,
		);

		writeFileSync(env.OUT, JSON.stringify(prospects));
		writeFileSync(`${env.OUT}.log.txt`, log.join("\n"));
	},
	3600000,
);
