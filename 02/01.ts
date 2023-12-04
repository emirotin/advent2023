import { readLines, sum } from "../lib/index.js";
import { LIMITS, parseLine } from "./lib.js";

const lines = readLines(import.meta.url, "input.txt")
	.map((l) => l.trim())
	.filter(Boolean);

const games = lines.map(parseLine);

const possibleGames = games.filter((game) =>
	game.draws.every(
		(draw) =>
			draw.red <= LIMITS.red &&
			draw.green <= LIMITS.green &&
			draw.blue <= LIMITS.blue
	)
);

console.log(sum(possibleGames.map(({ id }) => id)));
