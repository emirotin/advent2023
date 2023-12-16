import { readLines } from "../lib/index.js";
import { findEnergyLevel, parseLine } from "./lib.js";

const map = readLines(import.meta.url, "input.txt")
	.map((l) => l.trim())
	.filter(Boolean)
	.map(parseLine);

const rows = map.length;
const cols = map[0]!.length;

const starts = [
	...Array.from({ length: rows }, (_, r) => ({ r, c: -1, d: "e" as const })),
	...Array.from({ length: rows }, (_, r) => ({ r, c: cols, d: "w" as const })),
	...Array.from({ length: cols }, (_, c) => ({ r: -1, c, d: "s" as const })),
	...Array.from({ length: cols }, (_, c) => ({ r: rows, c, d: "n" as const })),
];

console.log(
	Math.max(...starts.map(({ r, c, d }) => findEnergyLevel(map, { r, c }, d)))
);
