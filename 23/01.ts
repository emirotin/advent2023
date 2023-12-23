import { readLines } from "../lib/index.js";

const parseLine = (line: string, i: number) =>
	line.split("") as Array<"." | "#" | "<" | ">" | "^" | "v">;

const map = readLines(import.meta.url, "input.txt")
	.map((l) => l.trim())
	.filter(Boolean)
	.map(parseLine);

const rows = map.length;
const cols = map[0]!.length;

const startC = map[0]!.findIndex((c) => c === ".");
const endC = map[rows - 1]!.findIndex((c) => c === ".");

type Coords = readonly [number, number];

const eq = (a: Coords) => (b: Coords) => a[0] === b[0] && a[1] === b[1];

const isNotUndefined = <T>(x: T | undefined): x is T => x !== undefined;

const longestPath = (
	cell: Coords,
	history: Coords[],
	acc: number = 0
): number => {
	if (cell[0] === 0 && cell[1] === startC) {
		return acc;
	}

	const comingFrom = [
		[cell[0] - 1, cell[1], "v", -1, 0] as const,
		[cell[0] + 1, cell[1], "^", 1, 0] as const,
		[cell[0], cell[1] - 1, ">", 0, -1] as const,
		[cell[0], cell[1] + 1, "<", 0, 1] as const,
	]
		.filter(
			(c) =>
				c[0] >= 0 &&
				c[0] < rows &&
				c[1] >= 0 &&
				c[1] < cols &&
				map[c[0]]![c[1]] !== "#"
		)
		.map((c) =>
			map[c[0]]![c[1]]! === c[2]
				? ([c[0] + c[3], c[1] + c[4], 2] as const)
				: map[c[0]]![c[1]]! !== "."
				? undefined
				: ([c[0], c[1], 1] as const)
		)
		.filter(isNotUndefined)
		.filter((n) => !history.find(eq([n[0], n[1]])));

	return Math.max(
		...comingFrom.map(([x, y, d]) =>
			longestPath([x, y], [...history, cell], acc + d)
		)
	);
};

console.log(longestPath([rows - 1, endC], []));
