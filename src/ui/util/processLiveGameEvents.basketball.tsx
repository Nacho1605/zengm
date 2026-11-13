import { getPeriodName } from "../../common/getPeriodName.ts";
import { choice } from "../../common/random.ts";
import { helpers } from "./helpers.ts";
import { local } from "./local.ts";
import type { PlayByPlayEventOutput } from "../../worker/core/GameSim.basketball/PlayByPlayLogger.ts";
import type { ReactNode } from "react";
import { formatClock } from "../../common/formatClock.ts";
import { formatLiveGameStat } from "./formatLiveGameStat.ts";
import type { PlayByPlayEvent } from "../../worker/core/GameSim/PlayByPlayLoggerBase.ts";
import { isFutbolEs } from "../../common/futbolEs.ts";

const getPronoun = (pronoun: Parameters<typeof helpers.pronoun>[1]) => {
	return helpers.pronoun(local.getState().gender, pronoun);
};

let playersByPidGid: number | undefined;
let playersByPid:
	| Record<
			number,
			{
				[key: string]: number | string | boolean; // bit of a hack, generic key names which can be either a number, string or boolean. essentially an any type
				name: string;
				inGame: boolean;
			}
	  >
	| undefined;

const getName = (pid: number) => {
	return playersByPid?.[pid]?.name ?? "???";
};

const isKeeper = (pid: number) => (playersByPid?.[pid] as any)?.pos === "C";

// Fútbol mode: the play-by-play in Spanish, with fútbol vocabulary
const getTextFutbol = (event: PlayByPlayEventOutput): ReactNode => {
	if (playersByPid === undefined) {
		throw new Error("playersByPid is undefined");
	}
	const p = playersByPid;
	const name = (pid: number) => getName(pid);
	const gol = (pid: number) => formatLiveGameStat(p[pid], "pts");

	let texts: ReactNode[] | undefined;
	let weights: number[] | undefined;

	switch (event.type) {
		case "period":
			texts = [
				event.period === 1
					? "Comienza el primer tiempo"
					: event.period === 2
						? "Comienza el segundo tiempo"
						: `Comienza el período ${event.period}`,
			];
			break;
		case "overtime":
			texts = ["Comienza el alargue"];
			break;
		case "injury":
			texts = [`¡${name(event.pid)} se lesionó!`];
			break;
		case "tov":
			texts = event.outOfBounds
				? [`${name(event.pid)} la manda afuera`]
				: [
						`${name(event.pid)} pierde la pelota${formatLiveGameStat(p[event.pid], "tov")}`,
						`Mal pase de ${name(event.pid)}${formatLiveGameStat(p[event.pid], "tov")}`,
					];
			break;
		case "stl":
			texts = [
				`${name(event.pid)} le roba la pelota a ${name(event.pidTov)}${formatLiveGameStat(p[event.pid], "stl")}`,
				`Gran quite de ${name(event.pid)} ante ${name(event.pidTov)}${formatLiveGameStat(p[event.pid], "stl")}`,
			];
			break;
		case "fgaTipIn":
			texts = [`Centro de ${name(event.pidPass)} y ${name(event.pid)} cabecea`];
			break;
		case "fgaPutBack":
			texts = [`${name(event.pid)} toma el rebote y remata`];
			break;
		case "fgaAtRim":
			texts = [
				`${name(event.pid)} queda mano a mano con el arquero`,
				`${name(event.pid)} define desde el área chica`,
			];
			break;
		case "fgaLowPost":
			texts = [
				`${name(event.pid)} remata dentro del área`,
				`${name(event.pid)} cabecea en el área`,
			];
			break;
		case "fgaMidRange":
			texts = [`${name(event.pid)} remata desde la puerta del área`];
			break;
		case "fgaTp":
		case "fgaTpFake":
			texts = event.desperation
				? [`${name(event.pid)} prueba desde muy lejos sobre el final`]
				: [
						`${name(event.pid)} prueba de media distancia`,
						`${name(event.pid)} saca un remate de lejos`,
					];
			break;
		case "fgTipIn":
		case "fgTipInAndOne":
		case "fgPutBack":
		case "fgPutBackAndOne":
		case "fgLowPost":
		case "fgLowPostAndOne":
		case "fgMidRange":
		case "fgMidRangeAndOne":
		case "tp":
		case "tpAndOne":
			texts = [
				`¡GOOOL de ${name(event.pid)}!${gol(event.pid)}`,
				`¡Adentro! Gol de ${name(event.pid)}${gol(event.pid)}`,
				`¡Golazo de ${name(event.pid)}!${gol(event.pid)}`,
			];
			weights = [3, 2, event.type === "tp" ? 3 : 1];
			break;
		case "fgAtRim":
		case "fgAtRimAndOne":
			texts = [
				`¡GOOOL de ${name(event.pid)}! Le gana a ${name(event.pidDefense)}${gol(event.pid)}`,
				`¡Adentro! ${name(event.pid)} la empuja${gol(event.pid)}`,
			];
			break;
		case "blkAtRim":
		case "blkTipIn":
		case "blkPutBack":
		case "blkLowPost":
		case "blkMidRange":
		case "blkTp":
			texts = isKeeper(event.pid)
				? [
						`¡Atajada de ${name(event.pid)}!${formatLiveGameStat(p[event.pid], "blk")}`,
						`¡Qué tapada de ${name(event.pid)}!${formatLiveGameStat(p[event.pid], "blk")}`,
					]
				: [
						`Lo bloquea ${name(event.pid)}${formatLiveGameStat(p[event.pid], "blk")}`,
						`${name(event.pid)} se cruza y tapa el remate${formatLiveGameStat(p[event.pid], "blk")}`,
					];
			break;
		case "missTipIn":
		case "missAtRim":
		case "missPutBack":
		case "missLowPost":
		case "missMidRange":
		case "missTp":
			texts = [
				"Se va desviado",
				"¡Pegó en el palo!",
				"Por arriba del travesaño",
				"Se va afuera por poco",
			];
			weights = [4, 1, 2, 2];
			break;
		case "orb":
			texts = [`${name(event.pid)} gana la segunda pelota en el área rival`];
			break;
		case "drb":
			texts = isKeeper(event.pid)
				? [`${name(event.pid)} se queda con la pelota`]
				: [
						`${name(event.pid)} despeja`,
						`${name(event.pid)} recupera la pelota`,
					];
			break;
		case "gameOver":
			texts = ["¡Final del partido!"];
			break;
		case "ft":
			texts = [`¡Gol de penal de ${name(event.pid)}!${gol(event.pid)}`];
			break;
		case "missFt":
			texts = [
				`¡${name(event.pid)} erra el penal!`,
				`¡El arquero le ataja el penal a ${name(event.pid)}!`,
			];
			break;
		case "pfNonShooting":
		case "pfBonus":
			texts = [
				`Falta de ${name(event.pid)}. Tarjeta amarilla${formatLiveGameStat(p[event.pid], "pf")}`,
			];
			break;
		case "pfFG":
		case "pfTP":
			texts = [
				<>
					¡Penal! Falta de {name(event.pid)} sobre {name(event.pidShooting)}
					<br />
					Tarjeta amarilla para {name(event.pid)}
					{formatLiveGameStat(p[event.pid], "pf")}
				</>,
			];
			break;
		case "foulOut":
			texts = [
				<span className="text-danger">
					¡Roja! {name(event.pid)} se va expulsado por doble amarilla
				</span>,
			];
			break;
		case "sub":
			texts = [
				<>
					Cambio. Entra: {event.pids.map((pid) => name(pid)).join(", ")}
					<br />
					Sale: {event.pidsOff.map((pid) => name(pid)).join(", ")}
				</>,
			];
			break;
		case "jumpBall":
			texts = ["¡Rueda la pelota!"];
			break;
		case "timeout":
			texts = ["Pausa"];
			break;
		case "endOfPeriod":
			texts = ["Final del tiempo"];
			break;
		case "outOfBounds":
			texts = ["La pelota sale por el lateral"];
			break;
		case "shootoutStart":
			texts = [`¡Se define por penales, ${event.rounds} por equipo!`];
			break;
		case "shootoutTeam":
			texts = [`${name(event.pid)} se prepara para patear`];
			break;
		case "shootoutShot":
			texts = event.made
				? ["¡Gol!", "¡Adentro!", "¡La clavó en el ángulo!"]
				: ["¡Atajó el arquero!", "¡Se fue afuera!", "¡Pegó en el palo!"];
			weights = event.made ? [3, 2, 1] : [3, 2, 1];
			break;
		case "shootoutTie":
			texts = [
				"Sigue la igualdad. Penales alternados hasta que haya un ganador",
			];
			break;
		default:
			texts = undefined;
	}

	if (!texts) {
		throw new Error(`No text for ${event.type}`);
	}

	let text = choice(texts, weights);

	const eAny = event as any;
	if (eAny.pidAst !== undefined) {
		text = (
			<>
				{text}
				<br />
				<span className="text-body-secondary">
					Asistencia de {name(eAny.pidAst)}
					{formatLiveGameStat(p[eAny.pidAst], "ast")}
				</span>
			</>
		);
	}

	return text;
};

const getText = (
	event: PlayByPlayEventOutput,
	boxScore: {
		numPeriods: number;
		teams: [
			{ pts: number; players: unknown[] },
			{ pts: number; players: unknown[] },
		];
	},
) => {
	if (isFutbolEs()) {
		return getTextFutbol(event);
	}

	let texts: ReactNode[] | undefined;
	let weights;
	if (playersByPid === undefined) {
		throw new Error("playersByPid is undefined");
	}

	if (event.type === "period") {
		texts = [
			`Start of ${helpers.ordinal(event.period)} ${getPeriodName(
				boxScore.numPeriods,
			)}`,
		];
	} else if (event.type === "overtime") {
		const overtimes = event.period - boxScore.numPeriods;
		texts = [
			`Start of ${
				overtimes === 1 ? "" : `${helpers.ordinal(overtimes)} `
			} overtime`,
		];
	} else if (event.type === "injury") {
		texts = [`${getName(event.pid)} was injured!`];
	} else if (event.type === "tov") {
		if (event.outOfBounds) {
			texts = [
				`${getName(event.pid)} loses the ball out of bounds${formatLiveGameStat(playersByPid[event.pid], "tov")}`,
			];
		} else {
			texts = [
				`${getName(event.pid)} turns the ball over${formatLiveGameStat(playersByPid[event.pid], "tov")}`,
			];
		}
	} else if (event.type === "stl") {
		if (event.outOfBounds) {
			texts = [
				`${getName(event.pid)} knocks the ball out of bounds${formatLiveGameStat(playersByPid[event.pid], "stl")} off ${getName(
					event.pidTov,
				)}${formatLiveGameStat(playersByPid[event.pidTov], "tov")}`,
			];
		} else {
			texts = [
				`${getName(event.pid)} stole${formatLiveGameStat(playersByPid[event.pid], "stl")} the ball from ${getName(event.pidTov)}${formatLiveGameStat(playersByPid[event.pidTov], "tov")}`,
			];
		}
	} else if (event.type === "fgaTipIn") {
		texts = [
			`${getName(event.pid)} cuts to the rim as ${getName(
				event.pidPass,
			)} lobs up the inbound pass`,
		];
	} else if (event.type === "fgaPutBack") {
		texts = [`${getName(event.pid)} puts the offensive rebound back up`];
	} else if (event.type === "fgaAtRim") {
		texts = [`${getName(event.pid)} elevates for a shot at the rim`];
	} else if (event.type === "fgaLowPost") {
		texts = [`${getName(event.pid)} attempts a low post shot`];
	} else if (event.type === "fgaMidRange") {
		texts = [`${getName(event.pid)} attempts a mid-range shot`];
	} else if (event.type === "fgaTp") {
		if (event.desperation) {
			texts = [
				`${getName(event.pid)} throws up a deep three as time winds down`,
			];
		} else {
			texts = [`${getName(event.pid)} attempts a three pointer`];
		}
	} else if (event.type === "fgaTpFake") {
		// This is for when threePointers is false
		if (event.desperation) {
			texts = [
				`${getName(event.pid)} throws up a deep shot as time winds down`,
			];
		} else {
			texts = [`${getName(event.pid)} attempts a deep shot`];
		}
	} else if (event.type === "fgTipIn") {
		const he = getPronoun("He");
		texts = [
			`${he} slams it home!${formatLiveGameStat(playersByPid[event.pid], "pts")}`,
			`${he} tips it in!${formatLiveGameStat(playersByPid[event.pid], "pts")}`,
		]; // Not sure if the pronoun should be replaced
		weights = local.getState().gender === "male" ? [1, 1] : [0, 1];
	} else if (event.type === "fgTipInAndOne") {
		const he = getPronoun("He");
		texts = [
			`${he} slams it home${formatLiveGameStat(playersByPid[event.pid], "pts")}, and a foul!`,
			`${he} tips it in${formatLiveGameStat(playersByPid[event.pid], "pts")}, and a foul!`,
		];
		weights = local.getState().gender === "male" ? [1, 1] : [0, 1];
	} else if (event.type === "fgPutBack") {
		const he = getPronoun("He");
		texts = [
			`${he} slams it home!${formatLiveGameStat(playersByPid[event.pid], "pts")}`,
			`${he} lays it in!${formatLiveGameStat(playersByPid[event.pid], "pts")}`,
		];
		weights = local.getState().gender === "male" ? [1, 1] : [0, 1];
	} else if (event.type === "fgPutBackAndOne") {
		const he = getPronoun("He");

		texts = [
			`${he} slams it home, and a foul!${formatLiveGameStat(playersByPid[event.pid], "pts")}`,
			`${he} lays it in, and a foul!${formatLiveGameStat(playersByPid[event.pid], "pts")}`,
		];
		weights = local.getState().gender === "male" ? [1, 1] : [0, 1];
	} else if (event.type === "fgAtRim") {
		const he = getPronoun("He");

		texts = [
			`${he} throws it down on ${getName(event.pidDefense)}!${formatLiveGameStat(playersByPid[event.pid], "pts")}`,
			`${he} slams it home${formatLiveGameStat(playersByPid[event.pid], "pts")}`,
			`The layup is good${formatLiveGameStat(playersByPid[event.pid], "pts")}`,
		];
		weights = local.getState().gender === "male" ? [1, 2, 2] : [1, 10, 1000];
	} else if (event.type === "fgAtRimAndOne") {
		const he = getPronoun("He");
		texts = [
			`${he} throws it down on ${getName(event.pidDefense)}, and a foul!${formatLiveGameStat(playersByPid[event.pid], "pts")}`,
			`${he} slams it home, and a foul!${formatLiveGameStat(playersByPid[event.pid], "pts")}`,
			`The layup is good, and a foul!${formatLiveGameStat(playersByPid[event.pid], "pts")}`,
		];
		weights = local.getState().gender === "male" ? [1, 2, 2] : [1, 10, 1000];
	} else if (
		event.type === "fgLowPost" ||
		event.type === "fgMidRange" ||
		event.type === "tp"
	) {
		texts = [`It's good!${formatLiveGameStat(playersByPid[event.pid], "pts")}`];
	} else if (
		event.type === "fgLowPostAndOne" ||
		event.type === "fgMidRangeAndOne" ||
		event.type === "tpAndOne"
	) {
		texts = [
			`It's good and a foul!${formatLiveGameStat(playersByPid[event.pid], "pts")}`,
		];
	} else if (
		event.type === "blkAtRim" ||
		event.type === "blkTipIn" ||
		event.type === "blkPutBack"
	) {
		texts = [
			`${getName(event.pid)} blocked the layup attempt${formatLiveGameStat(playersByPid[event.pid], "blk")}`,
			`${getName(event.pid)} blocked the dunk attempt${formatLiveGameStat(playersByPid[event.pid], "blk")}`,
		];
		if (local.getState().gender === "female") {
			weights = [1, 0];
		}
	} else if (
		event.type === "blkLowPost" ||
		event.type === "blkMidRange" ||
		event.type === "blkTp"
	) {
		texts = [
			`Blocked by ${getName(event.pid)}!${formatLiveGameStat(playersByPid[event.pid], "blk")}`,
		];
	} else if (event.type === "missTipIn") {
		const he = getPronoun("He");
		texts = [`${he} blows the layup`, `${he} blows the dunk`, "No good"];
		if (local.getState().gender === "female") {
			weights = [1, 0, 1];
		}
	} else if (event.type === "missAtRim" || event.type === "missPutBack") {
		texts = [
			`${getPronoun("He")} missed the layup`,
			"The layup attempt rolls out",
			"No good",
		];
		weights = [1, 1, 3];
	} else if (
		event.type === "missLowPost" ||
		event.type === "missMidRange" ||
		event.type === "missTp"
	) {
		texts = ["The shot rims out", "No good", `${getPronoun("He")} bricks it`];
		weights = [1, 4, 1];
	} else if (event.type === "orb") {
		const trb =
			(playersByPid[event.pid] as any).drb +
			(playersByPid[event.pid] as any).orb;
		texts = [
			`${getName(event.pid)} grabbed the offensive rebound${formatLiveGameStat(trb, "trb")}`,
		];
	} else if (event.type === "drb") {
		const trb =
			(playersByPid[event.pid] as any).drb +
			(playersByPid[event.pid] as any).orb;

		texts = [
			`${getName(event.pid)} grabbed the defensive rebound${formatLiveGameStat(trb, "trb")}`,
		];
	} else if (event.type === "gameOver") {
		texts = ["End of game"];
	} else if (event.type === "ft") {
		texts = [
			`${getName(event.pid)} made a free throw${formatLiveGameStat(playersByPid[event.pid], "pts")}`,
		];
	} else if (event.type === "missFt") {
		texts = [`${getName(event.pid)} missed a free throw`];
	} else if (event.type === "pfNonShooting") {
		texts = [
			`Non-shooting foul on ${getName(event.pid)}${formatLiveGameStat(playersByPid[event.pid], "pf")}`,
		];
	} else if (event.type === "pfBonus") {
		texts = [
			<>
				Non-shooting foul on {getName(event.pid)}
				{formatLiveGameStat(playersByPid[event.pid], "pf")}
				<br />
				They are in the penalty, so two FTs for {getName(event.pidShooting)}
			</>,
		];
	} else if (event.type === "pfFG") {
		texts = [
			<>
				Shooting foul on {getName(event.pid)}
				{formatLiveGameStat(playersByPid[event.pid], "pf")}
				<br />
				Two FTs for {getName(event.pidShooting)}
			</>,
		];
	} else if (event.type === "pfTP") {
		texts = [
			<>
				Shooting foul on {getName(event.pid)}
				{formatLiveGameStat(playersByPid[event.pid], "pf")}
				<br />
				Three FTs for {getName(event.pidShooting)}
			</>,
		];
	} else if (event.type === "foulOut") {
		texts = [
			<span className="text-danger">{getName(event.pid)} fouled out</span>,
		];
	} else if (event.type === "sub") {
		texts = [
			<>
				On: {event.pids.map((pid) => getName(pid)).join(", ")}
				<br />
				Off: {event.pidsOff.map((pid) => getName(pid)).join(", ")}
			</>,
		];
	} else if (event.type === "jumpBall") {
		texts = [
			`${getName(event.pid)} won the jump ball against ${getName(event.pid2)}`,
		];
	} else if (event.type === "elamActive") {
		texts = [`Elam Ending activated! First team to ${event.target} wins.`];
	} else if (event.type === "timeout") {
		texts = [
			`Timeout (${event.numLeft} remaining)${
				event.advancesBall ? ", the ball is advanced to half court" : ""
			}`,
		];
	} else if (event.type === "endOfPeriod") {
		if (event.reason === "runOutClock") {
			texts = ["They ran out the clock to end the game"];
		} else if (event.reason === "noShot") {
			texts = ["They didn't get a shot up before the buzzer"];
		} else {
			texts = ["The clock ran out as the defense tried to foul"];
		}
	} else if (event.type === "outOfBounds") {
		texts = [`Out of bounds, last touched by the ${event.on}`];
	} else if (event.type === "shootoutStart") {
		texts = [
			`The game will now be decided by a three-point shootout with ${event.rounds} rounds!`,
		];
	} else if (event.type === "shootoutTeam") {
		texts = [`${getName(event.pid)} steps up to the line`];
	} else if (event.type === "shootoutShot") {
		const he = getPronoun("He");
		texts = event.made
			? ["It's good!", "Swish!", "It rattles around but goes in!"]
			: [
					"It rims out!",
					`${he} bricks it!`,
					`${he} misses everything, airball!`,
				];
		weights = event.made ? [1, 0.25, 0.25] : [1, 0.1, 0.01];
	} else if (event.type === "shootoutTie") {
		texts = [
			"The shootout is tied! Players will alternate shots until there is a winner",
		];
	}

	if (texts) {
		let text = choice(texts, weights);

		const eAny = event as any;
		if (eAny.pidAst !== undefined) {
			text = (
				<>
					{text}
					<br />
					<span className="text-body-secondary">
						Assisted by {getName(eAny.pidAst)}
						{formatLiveGameStat(playersByPid[eAny.pidAst], "ast")}
					</span>
				</>
			);
		}

		if (eAny.pidFoul !== undefined) {
			// Hack! eed to add 1 because the pf stat is not logged until after this event, and it's tricky to fix that
			const pf = (playersByPid[eAny.pidFoul]!.pf as number) + 1;
			text = (
				<>
					{text}
					<br />
					<span className="text-body-secondary">
						Foul on {getName(eAny.pidFoul)}
						{formatLiveGameStat(pf, "pf")}
					</span>
				</>
			);
		}

		return text;
	} else {
		throw new Error(`No text for ${event.type}`);
	}
};

// false means assign possession to other team
const newPossessionTypes: Record<string, boolean> = {
	fgAtRim: true,
	fgAtRimAndOne: true,
	fgLowPost: true,
	fgLowPostAndOne: true,
	fgMidRange: true,
	fgMidRangeAndOne: true,
	ft: true,
	tp: true,
	tpAndOne: true,
	drb: true,
	fgaTipIn: true,
	fgaPutBack: true,
	fgaAtRim: true,
	fgaLowPost: true,
	fgaMidRange: true,
	fgaTp: true,
	fgaTpFake: true,
	jumpBall: true,
	missAtRim: true,
	missFt: true,
	missLowPost: true,
	missMidRange: true,
	missTp: true,
	orb: true,
	stl: true,
	tov: false,
	timeout: true,
	endOfPeriod: true,
};

// Mutates boxScore!!!
const processLiveGameEvents = ({
	events,
	boxScore,
	overtimes,
	quarters,
}: {
	events: PlayByPlayEvent<PlayByPlayEventOutput>[];
	boxScore: any;
	overtimes: number;
	quarters: string[];
}) => {
	if (
		!playersByPid ||
		boxScore.gid !== playersByPidGid ||
		events[0]?.type === "init"
	) {
		playersByPidGid = boxScore.gid;
		playersByPid = {};
		for (const t of boxScore.teams) {
			for (const p of t.players) {
				playersByPid[p.pid] = p;
			}
		}
	}
	let stop = false;
	let text;
	let t: 0 | 1 | undefined;
	let textOnly = false;

	while (!stop && events.length > 0) {
		const e = events.shift();
		if (!e) {
			continue;
		}

		const eAny = e as any;

		const eventT: 0 | 1 | undefined =
			eAny.t === 0 || eAny.t === 1 ? eAny.t : undefined;

		// Hacky quarter stuff, ugh
		if (
			e.type === "period" ||
			e.type === "overtime" ||
			boxScore.quarter === ""
		) {
			boxScore.teams[0].ptsQtrs.push(0);
			boxScore.teams[1].ptsQtrs.push(0);
			const quarter = boxScore.teams[0].ptsQtrs.length;
			if (quarter > boxScore.numPeriods) {
				overtimes = quarter - boxScore.numPeriods;
				if (overtimes === 1) {
					boxScore.overtime = "(OT)";
				} else if (overtimes > 1) {
					boxScore.overtime = `(${overtimes}OT)`;
				}
				boxScore.quarter = isFutbolEs()
					? "Alargue"
					: `${helpers.ordinal(overtimes)} overtime`;
				boxScore.quarterShort = isFutbolEs()
					? "AL"
					: overtimes === 1
						? "OT"
						: `${overtimes}OT`;
			} else {
				boxScore.quarter = isFutbolEs()
					? quarter === 1
						? "Primer tiempo"
						: quarter === 2
							? "Segundo tiempo"
							: `Período ${quarter}`
					: `${helpers.ordinal(quarter)} ${getPeriodName(boxScore.numPeriods)}`;
				boxScore.quarterShort = `${getPeriodName(
					boxScore.numPeriods,
					true,
				)}${quarter}`;
				quarters.push(boxScore.quarterShort);
			}
		} else if (e.type === "shootoutStart") {
			boxScore.shootout = true;
			boxScore.teams[0].sPts = 0;
			boxScore.teams[0].sAtt = 0;
			boxScore.teams[1].sPts = 0;
			boxScore.teams[1].sAtt = 0;
		}

		if (e.type === "stat") {
			// Quarter-by-quarter score
			if (e.s === "pts") {
				const ptsQtrs = boxScore.teams[eventT!].ptsQtrs;
				ptsQtrs[ptsQtrs.length - 1] += e.amt;
				boxScore.teams[eventT!].ptsQtrs = ptsQtrs;
			}

			// Everything else
			if (
				e.s === "min" ||
				e.s === "fg" ||
				e.s === "fga" ||
				e.s === "tp" ||
				e.s === "tpa" ||
				e.s === "ft" ||
				e.s === "fta" ||
				e.s === "orb" ||
				e.s === "drb" ||
				e.s === "ast" ||
				e.s === "tov" ||
				e.s === "stl" ||
				e.s === "blk" ||
				e.s === "ba" ||
				e.s === "pf" ||
				e.s === "pts"
			) {
				const p = playersByPid[e.pid!];
				(p as any)[e.s] += e.amt;
				boxScore.teams[eventT!][e.s] += e.amt;

				if (e.s === "pts") {
					for (let j = 0; j < 2; j++) {
						for (let k = 0; k < boxScore.teams[j].players.length; k++) {
							if (boxScore.teams[j].players[k].inGame) {
								boxScore.teams[j].players[k].pm +=
									eventT === j ? e.amt : -e.amt;
							}
						}
					}
				}
			} else if (e.s === "gs") {
				const p = playersByPid[e.pid!]!;
				p.inGame = true;
			} else if (e.s === "sPts" || e.s === "sAtt") {
				// Shootout
				boxScore.teams[eventT!][e.s] += e.amt;
			}
		} else if (e.type === "timeouts") {
			boxScore.teams[0].timeouts = e.timeouts[0];
			boxScore.teams[1].timeouts = e.timeouts[1];
		} else if (e.type !== "init") {
			text = getText(e, boxScore);
			t = eventT;
			textOnly =
				e.type === "gameOver" ||
				e.type === "period" ||
				e.type === "overtime" ||
				e.type === "elamActive" ||
				e.type === "shootoutStart" ||
				e.type === "shootoutTie" ||
				e.type === "shootoutTeam";

			let time;
			if (eAny.clock !== undefined) {
				const seconds = eAny.clock;
				time = formatClock(seconds);
			}

			if (e.type === "injury") {
				const p = playersByPid[e.pid];
				if (p) {
					(p as any).injury = {
						type: "Injured",
						gamesRemaining: -1,
					};
				}
			}

			if (e.type === "sub") {
				for (const pid of e.pids) {
					playersByPid[pid]!.inGame = true;
				}
				for (const pid of e.pidsOff) {
					playersByPid[pid]!.inGame = false;
				}
			} else if (e.type === "elamActive") {
				boxScore.elamTarget = e.target;
			}

			if (time) {
				boxScore.time = time;
			}

			if (Object.hasOwn(newPossessionTypes, eAny.type)) {
				boxScore.possession = newPossessionTypes[eAny.type]
					? eventT
					: eventT === 0
						? 1
						: 0;
			}

			stop = true;
		}
	}

	return {
		overtimes,
		quarters,
		t,
		text,
		textOnly,
	};
};

export default processLiveGameEvents;
