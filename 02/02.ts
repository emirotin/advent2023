import { readLines, sum } from "../lib/index.js";
import { type Draw, parseLine } from "./lib.js";

const lines = readLines(import.meta.url, "input.txt")
	.map((l) => l.trim())
	.filter(Boolean);

const games = lines.map(parseLine);

const minCubes = (draws: Draw[]) =>
	draws.reduce<Draw>(
		(acc, draw) => ({
			red: Math.max(acc.red, draw.red),
			green: Math.max(acc.green, draw.green),
			blue: Math.max(acc.blue, draw.blue),
		}),
		{ red: 0, green: 0, blue: 0 }
	);

const power = (draw: Draw) => draw.red * draw.green * draw.blue;

const powers = games
	.map(({ draws }) => draws)
	.map(minCubes)
	.map(power);

console.log(sum(powers));
