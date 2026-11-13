import { assert, describe, test } from "vitest";
import {
	countLines,
	findStartersFutbol,
	isValidFutbolLineup,
	lineupViolations,
} from "./futbol.ts";

// Formaciones expresadas con etiquetas de BBGM
const F433 = ["C", "GF", "PF", "FC", "GF", "G", "SG", "PG", "SF", "F", "SF"];
const F442 = ["C", "GF", "PF", "FC", "GF", "G", "SG", "SF", "SF", "F", "F"];
const F352 = ["C", "PF", "FC", "PF", "GF", "GF", "G", "SG", "PG", "F", "F"];
const F4231 = ["C", "GF", "PF", "FC", "GF", "G", "G", "PG", "SF", "SF", "F"];

describe("isValidFutbolLineup", () => {
	test("acepta formaciones habituales", () => {
		for (const lineup of [F433, F442, F352, F4231]) {
			assert.strictEqual(isValidFutbolLineup(lineup), true, lineup.join());
		}
	});

	test("rechaza sin arquero o con dos arqueros", () => {
		const noGk = ["SG", ...F433.slice(1)];
		assert.strictEqual(isValidFutbolLineup(noGk), false);
		const twoGk = [...F433.slice(0, 10), "C"];
		assert.strictEqual(isValidFutbolLineup(twoGk), false);
	});

	test("exige al menos 3 defensores y como máximo 5", () => {
		const twoDef = [
			"C",
			"PF",
			"FC",
			"G",
			"SG",
			"PG",
			"G",
			"SG",
			"F",
			"F",
			"SF",
		];
		assert.strictEqual(isValidFutbolLineup(twoDef), false);
		const sixDef = [
			"C",
			"GF",
			"PF",
			"FC",
			"GF",
			"PF",
			"FC",
			"G",
			"SG",
			"PG",
			"F",
		];
		assert.strictEqual(isValidFutbolLineup(sixDef), false);
	});

	test("exige al menos 1 delantero centro, pero un SF puede jugar de delantero", () => {
		// Sin F ni SF: inválida
		const noFwd = [
			"C",
			"GF",
			"PF",
			"FC",
			"GF",
			"G",
			"SG",
			"PG",
			"G",
			"SG",
			"PG",
		];
		assert.strictEqual(isValidFutbolLineup(noFwd), false);
		// Sin F, con SF que juega de delantero: válida
		const sfUp = [
			"C",
			"GF",
			"PF",
			"FC",
			"GF",
			"G",
			"SG",
			"PG",
			"SF",
			"SF",
			"SF",
		];
		assert.strictEqual(isValidFutbolLineup(sfUp), true);
	});

	test("tope de 5 mediocampistas y 4 delanteros", () => {
		const sixMid = [
			"C",
			"GF",
			"PF",
			"FC",
			"G",
			"G",
			"SG",
			"SG",
			"PG",
			"PG",
			"F",
		];
		assert.strictEqual(isValidFutbolLineup(sixMid), false);
		const fiveFwd = ["C", "GF", "PF", "FC", "G", "SG", "F", "F", "F", "F", "F"];
		assert.strictEqual(isValidFutbolLineup(fiveFwd), false);
	});

	test("cuenta las infracciones", () => {
		assert.strictEqual(lineupViolations(countLines(F433)), 0);
		const noGk = ["SG", ...F433.slice(1)];
		assert.strictEqual(lineupViolations(countLines(noGk)), 1);
	});
});

describe("findStartersFutbol", () => {
	test("elige un once válido aunque los mejores sean todos delanteros", () => {
		// Plantel ordenado del mejor al peor
		const roster = [
			"F",
			"F",
			"F",
			"F",
			"F",
			"F",
			"SF",
			"SF",
			"PG",
			"SG",
			"G",
			"G",
			"PF",
			"FC",
			"GF",
			"GF",
			"PF",
			"C",
			"C",
		];
		const starters = findStartersFutbol(roster);
		assert.strictEqual(starters.length, 11);
		const positions = starters.map((i) => roster[i]!);
		assert.strictEqual(isValidFutbolLineup(positions), true, positions.join());
		// Un solo arquero, el mejor de los dos
		assert.deepStrictEqual(
			starters.filter((i) => roster[i] === "C"),
			[17],
		);
	});

	test("respeta el orden si el once ya es válido", () => {
		const starters = findStartersFutbol([...F433, "F", "C"]);
		assert.deepStrictEqual(starters, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
	});

	test("si no hay arquero, igual arma un once", () => {
		const roster = F433.map((pos) => (pos === "C" ? "FC" : pos));
		const starters = findStartersFutbol([...roster, "F", "G"]);
		assert.strictEqual(starters.length, 11);
	});
});
