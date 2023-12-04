import { readLines, sum } from "../lib/index.js";
import { parseLine } from "./lib.js";

const lines = readLines(import.meta.url, "input.txt")
	.map((l) => l.trim())
	.filter(Boolean)
	.map(parseLine);

const countLine = ([winning, draw]: number[][]) => {
	let res = 0;
	for (const n of draw!) {
		if (!winning!.includes(n)) continue;

		if (res === 0) {
			res = 1;
		} else {
			res *= 2;
		}
	}

	return res;
};

console.log(sum(lines.map(countLine)));
