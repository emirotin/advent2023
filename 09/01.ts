import { readLines, parseNums, sum } from "../lib/index.js";

const lines = readLines(import.meta.url, "input.txt")
	.map((l) => l.trim())
	.filter(Boolean)
	.map(parseNums);

const extrapolate = (ns: number[]) => {
	const cache = new Map<number, Map<number, number>>();

	// is is index, g is generation of derivatives, where 0 is the original sequence
	// when last derivative is 0, all of them are 0, by the way the sequences are built
	// we use memoization here to keep the algo simple while directly expressing the
	// recursive nature
	const getVal = (i: number, g: number): number => {
		if (g === 0) return ns[i]!;

		const cached = cache.get(g)?.get(i);

		if (cached !== undefined) return cached;

		const val = getVal(i + 1, g - 1) - getVal(i, g - 1);
		let c2 = cache.get(g);
		if (c2 === undefined) {
			c2 = new Map<number, number>();
			cache.set(g, c2);
		}
		c2.set(i, val);
		return val;
	};

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
