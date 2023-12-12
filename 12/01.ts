import { readLines, sum } from "../lib/index.js";
import { countOptions, parseLine } from "./lib.js";

const lines = readLines(import.meta.url, "input.txt")
	.map((l) => l.trim())
	.filter(Boolean)
	.map(parseLine);

console.log(
	sum(lines.map(({ chunks, counts }) => countOptions(chunks, counts)))
);
