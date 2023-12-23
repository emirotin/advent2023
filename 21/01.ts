import { readLines, uniq, parseNums } from "../lib/index.js";

let start = "";

const parseLine = (line: string, i: number) =>
	line.split("").map((ch, j) => {
		if (ch === "S") {
			start = `${i}-${j}`;
			return ".";
		}
		return ch;
	});

const map = readLines(import.meta.url, "input.txt")
	.map((l) => l.trim())
	.filter(Boolean)
	.map(parseLine);

const rows = map.length;
const cols = map[0]!.length;

const neighbors = (coord: string) => {
	const [r, c] = parseNums(coord, "-");

	return [
		[r! - 1, c],
		[r! + 1, c],
		[r, c! - 1],
		[r, c! + 1],
	]
		.filter(
			([r, c]) =>
				r! >= 0 && r! < rows && c! >= 0 && c! < cols && map[r!]![c!] === "."
		)
		.map(([r, c]) => `${r}-${c}`);
};

let reached = [start];
let steps = 0;

while (steps < 64) {
	reached = uniq(reached.flatMap(neighbors));
	steps += 1;
}

console.log(reached.length);
