import { readLines } from "../lib/index.js";
import { findEnergyLevel, parseLine } from "./lib.js";

const map = readLines(import.meta.url, "input.txt")
	.map((l) => l.trim())
	.filter(Boolean)
	.map(parseLine);

console.log(findEnergyLevel(map, { r: 0, c: -1 }, "e"));
