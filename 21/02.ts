import { readLines } from "../lib/index.js";

type Coords = readonly [number, number];

let start: Coords;

const parseLine = (line: string, i: number) =>
	line.split("").map((ch, j) => {
		if (ch === "S") {
			start = [i, j];
			return ".";
		}
		return ch;
	});

const map = readLines(import.meta.url, "demo.txt")
	.map((l) => l.trim())
	.filter(Boolean)
	.map(parseLine);

const rows = map.length;
const cols = map[0]!.length;

const memoize = <K extends number | string, T>(
	fn: (v: K) => T
): ((v: K) => T) => {
	const memo = new Map<K, T>();
	const wrapped = (v: K) => {
		if (memo.has(v)) return memo.get(v)!;
		const res = fn(v);
		memo.set(v, res);
		return res;
	};
	return wrapped;
};

const normR = memoize((r: number) => {
	while (r < 0) r += rows;
	return r % rows;
});

const normC = memoize((c: number) => {
	while (c < 0) c += cols;
	return c % cols;
});

const neighbors = ([r, c]: Coords) => {
	return [
		[r - 1, c] as const,
		[r + 1, c] as const,
		[r, c - 1] as const,
		[r, c + 1] as const,
	].filter(([r, c]) => map[normR(r)]![normC(c)] === ".");
};

let reached = [start!];
let steps = 0;

const uniq = (coords: Coords[]) => {};

while (steps < 26501365) {
	reached = uniq(reached.flatMap(neighbors));
	steps += 1;
	if (steps % 1_000 === 0) console.log(steps);
}

console.log(reached.length);
