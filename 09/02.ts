import { readLines, parseNums, sum } from "../lib/index.js";
import { getVal as _getVal } from "./lib.js";

const lines = readLines(import.meta.url, "input.txt")
	.map((l) => l.trim())
	.filter(Boolean)
	.map(parseNums);

const extrapolateLeft = (ns: number[]) => {
	const getVal = _getVal(ns);

	let g = 0;
	let n = ns.length;
	let result = 0;
	let mul = 1;
	while (getVal(n - 1, g) !== 0) {
		result += getVal(0, g) * mul;
		mul *= -1;
		g += 1;
		n -= 1;
	}

	return result;
};

console.log(sum(lines.map(extrapolateLeft)));
