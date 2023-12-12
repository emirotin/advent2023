import { readLines, parseNums, sum } from "../lib/index.js";
import { getVal as _getVal } from "./lib.js";

const lines = readLines(import.meta.url, "input.txt")
	.map((l) => l.trim())
	.filter(Boolean)
	.map((l) => parseNums(l));

const extrapolate = (ns: number[]) => {
	const getVal = _getVal(ns);

	let g = 0;
	let n = ns.length;
	let result = 0;
	let last;
	while ((last = getVal(n - 1, g)) !== 0) {
		result += last;
		g += 1;
		n -= 1;
	}

	return result;
};

console.log(sum(lines.map(extrapolate)));
