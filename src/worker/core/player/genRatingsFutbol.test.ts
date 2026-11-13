import { assert, beforeAll, describe, test } from "vitest";
// @ts-expect-error
import { writeFileSync } from "node:fs";
import { player } from "../index.ts";
import { g } from "../../util/index.ts";
import { resetG } from "../../../test/helpers.ts";
import { DEFAULT_LEVEL } from "../../../common/budgetLevels.ts";
import { COMPOSITE_WEIGHTS } from "../../../common/constants.ts";
import { FUTBOL_POSITION_PROFILES } from "./genRatingsFutbol.ts";

const COMPOSITES = [
	"blocking",
	"rebounding",
	"usage",
	"passing",
	"dribbling",
	"defense",
] as const;
const RATINGS = [
	"hgt",
	"stre",
	"spd",
	"jmp",
	"endu",
	"ins",
	"dnk",
	"ft",
	"fg",
	"tp",
	"oiq",
	"diq",
	"drb",
	"pss",
	"reb",
] as const;

type Summary = Record<string, Record<string, number>>;

const summary: Summary = {};
const counts: Record<string, number> = {};
const posChanged: number[] = [];

beforeAll(async () => {
	resetG();
	g.setWithoutSavingToDB("numPlayersOnCourt", 11);
	g.setWithoutSavingToDB("heightFactor", 0.9);

	for (let i = 0; i < 3000; i++) {
		const p = player.generate(
			-2,
			19,
			g.get("season") + 3,
			false,
			DEFAULT_LEVEL,
		);
		const fixedPos = (p as any).pos;

		// Develop to draft age, like real draft prospects
		await player.develop(p, 3);
		const r = p.ratings.at(-1)!;
		if (r.pos !== fixedPos || (p as any).pos !== fixedPos) {
			posChanged.push(i);
		}

		const pos = fixedPos as string;
		counts[pos] = (counts[pos] ?? 0) + 1;
		summary[pos] ??= {};
		const s = summary[pos];
		for (const key of RATINGS) {
			s[key] = (s[key] ?? 0) + (r as any)[key];
		}
		for (const key of COMPOSITES) {
			const cw = COMPOSITE_WEIGHTS[key]!;
			s[key] =
				(s[key] ?? 0) +
				player.compositeRating(r, cw.ratings, cw.weights, false);
		}
		s.cm = (s.cm ?? 0) + p.hgt * 2.54;
		s.ovr = (s.ovr ?? 0) + r.ovr;
	}

	for (const [pos, s] of Object.entries(summary)) {
		for (const key of Object.keys(s)) {
			s[key]! /= counts[pos]!;
		}
	}

	// Table for humans, in the scratchpad if available
	const order = Object.keys(FUTBOL_POSITION_PROFILES);
	const header = ["pos", "n", "cm", "ovr", ...RATINGS, ...COMPOSITES];
	const rows = order.map((pos) => [
		pos,
		counts[pos],
		...header
			.slice(2)
			.map((key) =>
				COMPOSITES.includes(key as any)
					? summary[pos]![key]!.toFixed(2)
					: Math.round(summary[pos]![key]!),
			),
	]);
	const diagFile = (globalThis as any).process?.env?.FUTBOL_DIAG_FILE;
	if (diagFile) {
		writeFileSync(
			diagFile,
			[header, ...rows].map((row) => row.join("\t")).join("\n"),
		);
	}
});

const avg = (pos: string, key: string) => summary[pos]![key]!;
const max = (key: string) =>
	Math.max(...Object.keys(summary).map((pos) => avg(pos, key)));

describe("fútbol player generation", () => {
	test("generates every position with a fixed position that survives development", () => {
		for (const pos of Object.keys(FUTBOL_POSITION_PROFILES)) {
			assert.isAbove(counts[pos] ?? 0, 100, pos);
		}
		assert.deepStrictEqual(posChanged, []);
	});

	test("goalkeepers block and rebound, with no offensive role", () => {
		assert.strictEqual(avg("C", "blocking"), max("blocking"));
		assert.strictEqual(avg("C", "rebounding"), max("rebounding"));
		// Shooting ratings are practically zero. oiq and drb are low but not zero,
		// since the sim uses them for ball security of the whole team.
		for (const key of ["ins", "dnk", "fg", "tp"]) {
			assert.isBelow(avg("C", key), 12, key);
		}
		for (const pos of Object.keys(summary)) {
			if (pos !== "C") {
				assert.isBelow(avg("C", "usage"), avg(pos, "usage") * 0.75, pos);
			}
		}
	});

	test("center backs are more defensive than offensive", () => {
		for (const pos of ["PF", "FC"]) {
			assert.isAbove(avg(pos, "defense"), avg(pos, "usage"), pos);
			assert.isAbove(avg(pos, "diq"), avg(pos, "oiq") + 15, pos);
			for (const attacker of ["PG", "SF", "F"]) {
				assert.isAbove(avg(pos, "defense"), avg(attacker, "defense"));
			}
		}
	});

	test("attacking midfielders are the best passers", () => {
		assert.strictEqual(avg("PG", "pss"), max("pss"));
		assert.strictEqual(avg("PG", "passing"), max("passing"));
	});

	test("wingers are the fastest", () => {
		assert.strictEqual(avg("SF", "spd"), max("spd"));
	});

	test("heights look like footballers", () => {
		assert.isAbove(avg("C", "cm"), 185);
		assert.isBelow(avg("SF", "cm"), 178);
		for (const pos of Object.keys(summary)) {
			assert.isAbove(avg(pos, "cm"), 168, pos);
			assert.isBelow(avg(pos, "cm"), 195, pos);
		}
	});
});
