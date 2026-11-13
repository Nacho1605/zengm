import { assert, beforeAll, describe, test } from "vitest";
import GameSim from "./index.ts";
import { player, team } from "../index.ts";
import loadTeams from "../game/loadTeams.ts";
import { g, helpers } from "../../util/index.ts";
import { resetCache, resetG } from "../../../test/helpers.ts";
import { DEFAULT_LEVEL } from "../../../common/budgetLevels.ts";
import {
	FUTBOL_MAX_SUBS,
	isValidFutbolLineup,
} from "../../../common/futbol.ts";

// A 24 player squad with every position covered
const SQUAD = [
	"C",
	"C",
	"GF",
	"GF",
	"GF",
	"GF",
	"PF",
	"PF",
	"FC",
	"FC",
	"FC",
	"G",
	"G",
	"SG",
	"SG",
	"PG",
	"PG",
	"SF",
	"SF",
	"SF",
	"F",
	"F",
	"F",
	"SG",
];

// Generate players until every position in SQUAD is filled. In fútbol mode,
// the generator already picks a fixed position with matching ratings.
const genSquad = async (tid: number) => {
	const need = [...SQUAD];
	const squad = [];
	while (need.length > 0) {
		const p = player.generate(tid, 25, 2010, true, DEFAULT_LEVEL);
		const index = need.indexOf((p as any).pos);
		if (index >= 0) {
			await player.develop(p, 0);
			// Approximate value, so that the coach makes voluntary substitutions
			const ovr = p.ratings.at(-1)!.ovr;
			p.value = ovr;
			p.valueNoPot = ovr;
			p.valueFuzz = ovr;
			p.valueNoPotFuzz = ovr;
			need.splice(index, 1);
			squad.push(p);
		}
	}
	return squad;
};

const setFutbolSettings = () => {
	g.setWithoutSavingToDB("numPlayersOnCourt", 11);
	g.setWithoutSavingToDB("numPeriods", 2);
	g.setWithoutSavingToDB("quarterLength", 45);
};

beforeAll(async () => {
	resetG();
	setFutbolSettings();
	const teamsDefault = helpers.getTeamsDefault().slice(0, 2);
	await resetCache({
		players: [...(await genSquad(0)), ...(await genSquad(1))],
		teams: teamsDefault.map(team.generate),
		teamSeasons: teamsDefault.map((t) => team.genSeasonRow(t)),
		teamStats: teamsDefault.map((t) => team.genStatsRow(t.tid)),
	});
	await team.rosterAutoSort(0);
	await team.rosterAutoSort(1);
});

const NUM_GAMES = 100;

describe("fútbol mode", () => {
	test("plays full games following the rules", async () => {
		let totalVoluntary = 0;
		for (let i = 0; i < NUM_GAMES; i++) {
			const teams = await loadTeams([0, 1], {});
			const game = new GameSim({
				gid: i,
				teams: [teams[0], teams[1]],
				baseInjuryRate: g.get("injuryRate"),
				doPlayByPlay: false,
				homeCourtFactor: 1,
				allStarGame: false,
				neutralSite: false,
			});

			assert.strictEqual(game.futbol, true);

			// Starting lineup must be valid
			for (const t of [0, 1] as const) {
				const positions = game.playersOnCourt[t].map((p) => p.pos);
				assert.strictEqual(positions.length, 11);
				assert.strictEqual(
					isValidFutbolLineup(positions),
					true,
					`starters ${positions.join()}`,
				);
			}

			// Check the rules after every substitution check during the game
			const subbedOff = [new Set<number>(), new Set<number>()];
			let numVoluntary = 0;
			const log: string[] = [];
			const original = game.updatePlayersOnCourt.bind(game);
			game.updatePlayersOnCourt = (args) => {
				const before = game.playersOnCourt.map((ps) => [...ps]);
				const result = original(args);
				for (const t of [0, 1] as const) {
					const now = game.playersOnCourt[t].map((p) => p.id);
					for (const p of before[t]!) {
						if (!now.includes(p.id)) {
							const b = game.playersOnCourt[t].find(
								(p2) => !before[t]!.includes(p2),
							);
							log.push(
								`t${t} ${game.t === undefined ? "start" : game.futbolElapsedMinutes().toFixed(0)}' out ${p.pos}${p.injured ? " (injured)" : ""} pf${p.stat.pf} -> in ${b?.pos}${b?.injured ? " (injured)" : ""}`,
							);
							subbedOff[t]!.add(p.id);
							const fouledOut = p.stat.pf >= g.get("foulsNeededToFoulOut");
							if (!p.injured && !fouledOut) {
								numVoluntary += 1;
								// Voluntary substitutions only from minute 55
								assert.isAtLeast(
									game.futbolElapsedMinutes(),
									55,
									`pf ${p.stat.pf}`,
								);
							}
						}
					}
					for (const pid of now) {
						assert.isFalse(subbedOff[t]!.has(pid), "a player came back");
					}
					const injured = game.playersOnCourt[t].some((p) => p.injured);
					const positions = game.playersOnCourt[t].map((p) => p.pos);
					if (!injured && !isValidFutbolLineup(positions)) {
						// Only allowed if no substitution could fix it: no subs left, or
						// no eligible bench player (e.g. both goalkeepers injured or sent off)
						const subsLeft = game.futbolSubsUsed[t] < FUTBOL_MAX_SUBS;
						const fixable =
							subsLeft &&
							game.team[t].player.some(
								(b) =>
									!game.playersOnCourt[t].includes(b) &&
									!game.futbolSubbedOff.has(b) &&
									!b.injured &&
									b.stat.pf < g.get("foulsNeededToFoulOut") &&
									positions.some((_, j) =>
										isValidFutbolLineup(
											positions.map((pos, k) => (k === j ? b.pos : pos)),
										),
									),
							);
						assert.isFalse(
							fixable,
							`lineup ${positions.join()}\n${log.join("\n")}`,
						);
					}
				}
				return result;
			};

			const result = game.run();
			totalVoluntary += numVoluntary;

			for (const t of [0, 1] as const) {
				assert.isAtMost(game.futbolSubsUsed[t], FUTBOL_MAX_SUBS);
				assert.isAtMost(subbedOff[t]!.size, FUTBOL_MAX_SUBS);

				// The goalkeeper never shoots and never assists
				for (const p of result.team[t].player) {
					if (p.pos === "C") {
						assert.strictEqual(p.stat.fga, 0, "goalkeeper shot");
						assert.strictEqual(p.stat.ast, 0, "goalkeeper assisted");
					}
				}

				// Nobody plays more than the whole game (overtime is at most 15 minutes here)
				for (const p of result.team[t].player) {
					assert.isAtMost(p.stat.min, 90 + 1e-6 + 15 * game.overtimes);
				}
			}
		}
		// Coaches do make voluntary substitutions: on average at least 2 per team
		assert.isAbove(totalVoluntary / (2 * NUM_GAMES), 2);
	});

	test("penalty shootout rotates kickers, goalkeeper last", async () => {
		for (let i = 0; i < 20; i++) {
			const teams = await loadTeams([0, 1], {});
			const game = new GameSim({
				gid: i,
				teams: [teams[0], teams[1]],
				baseInjuryRate: 0,
				doPlayByPlay: true,
				homeCourtFactor: 1,
				allStarGame: false,
				neutralSite: false,
			});
			game.team[0].stat.pts = 1;
			game.team[1].stat.pts = 1;
			game.shootoutRounds = 5;
			game.doShootout();

			const shots = game.playByPlay
				.getPlayByPlay()!
				.filter((e: any) => e.type === "shootoutShot") as any[];

			for (const t of [0, 1] as const) {
				const pids = shots.filter((e) => e.t === t).map((e) => e.pid);
				assert.isAtLeast(pids.length, 3);
				// The first five kickers are all different
				const firstFive = pids.slice(0, 5);
				assert.strictEqual(new Set(firstFive).size, firstFive.length);
				// The goalkeeper doesn't kick in the first ten rounds
				const keeper = game.playersOnCourt[t].find((p) => p.pos === "C")!;
				assert.notInclude(pids.slice(0, 10), keeper.id);
			}

			assert.notStrictEqual(game.team[0].stat.sPts, game.team[1].stat.sPts);
		}
	});
});
