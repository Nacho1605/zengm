import type { RatingKey } from "../../../common/types.basketball.ts";
import { isFutbolMode } from "../../../common/futbol.ts";
import { g } from "../../util/index.ts";

// Fútbol mode: the goalkeeper never shoots, so his shooting ratings have no
// effect in the game sim. Replace them by the average values used in the
// formula below, which makes their contribution 0.
const GOALKEEPER_NEUTRAL_RATINGS = {
	ins: 42.4,
	dnk: 49.5,
	ft: 47.0,
	fg: 47.0,
	tp: 47.1,
};

const ovr = (
	ratingsInput: Record<RatingKey, number>,
	posOverride?: string,
): number => {
	let ratings = ratingsInput;
	const pos = posOverride ?? (ratingsInput as { pos?: string }).pos;
	if (
		pos === "C" &&
		Object.hasOwn(g, "numPlayersOnCourt") &&
		isFutbolMode(g.get("numPlayersOnCourt"))
	) {
		ratings = { ...ratingsInput, ...GOALKEEPER_NEUTRAL_RATINGS };
	}

	// See analysis/player-ovr-basketball
	const r =
		0.159 * (ratings.hgt - 47.5) +
		0.0777 * (ratings.stre - 50.2) +
		0.123 * (ratings.spd - 50.8) +
		0.051 * (ratings.jmp - 48.7) +
		0.0632 * (ratings.endu - 39.9) +
		0.0126 * (ratings.ins - 42.4) +
		0.0286 * (ratings.dnk - 49.5) +
		0.0202 * (ratings.ft - 47.0) +
		0.0726 * (ratings.tp - 47.1) +
		0.133 * (ratings.oiq - 46.8) +
		0.159 * (ratings.diq - 46.7) +
		0.059 * (ratings.drb - 54.8) +
		0.062 * (ratings.pss - 51.3) +
		0.01 * (ratings.fg - 47.0) +
		0.01 * (ratings.reb - 51.4) +
		48.5;

	// Fudge factor to keep ovr ratings the same as they used to be (back before 2018 ratings rescaling)
	// +8 at 68
	// +4 at 50
	// -5 at 42
	// -10 at 31
	let fudgeFactor = 0;
	if (r >= 68) {
		fudgeFactor = 8;
	} else if (r >= 50) {
		fudgeFactor = 4 + (r - 50) * (4 / 18);
	} else if (r >= 42) {
		fudgeFactor = -5 + (r - 42) * (9 / 8);
	} else if (r >= 31) {
		fudgeFactor = -5 - (42 - r) * (5 / 11);
	} else {
		fudgeFactor = -10;
	}

	const val = Math.round(r + fudgeFactor);

	if (val > 100) {
		return 100;
	}
	if (val < 0) {
		return 0;
	}

	return val;
};

export default ovr;
