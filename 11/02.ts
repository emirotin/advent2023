import { readLines } from "../lib/index.js";
import { parseLine, findExpandedGalaxies, countDistances } from "./lib.js";

const matrix = readLines(import.meta.url, "input.txt")
	.map((l) => l.trim())
	.filter(Boolean)
	.map(parseLine);

const galaxies = findExpandedGalaxies(matrix, 1_000_000);

console.log(countDistances(galaxies));
