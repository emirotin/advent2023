import { readLines, sum } from "../lib/index.js";

const parseNums = (line: string) => line.split(/\s+/).map((n) => parseInt(n));

const parseLine = (line: string) => {
	const [_, nums] = line.split(": ");
	return nums!.trim().split(" | ").map(parseNums);
};

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
