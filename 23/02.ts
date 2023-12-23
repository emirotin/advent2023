import { readLines } from "../lib/index.js";

const parseLine = (line: string, i: number) =>
	line.split("").map((c) => (c === "#" ? "#" : "."));

const map = readLines(import.meta.url, "demo.txt")
	.map((l) => l.trim())
	.filter(Boolean)
	.map(parseLine);

const rows = map.length;
const cols = map[0]!.length;

const startC = map[0]!.findIndex((c) => c === ".");
const endC = map[rows - 1]!.findIndex((c) => c === ".");

type Coords = readonly [number, number];

const longestPaths = Array.from({ length: rows }, () =>
	Array.from({ length: cols })
) as Array<Array<{ d: number; h: string[] } | undefined>>;

longestPaths[0]![startC] = {
	d: 0,
	h: [],
};

const toCheck = [[0, startC] as Coords];

while (toCheck.length) {
	const coords = toCheck.shift()!;

	const coordsStr = `${coords[0]}-${coords[1]}`;

	const currentRecord = longestPaths[coords[0]]![coords[1]]!;
	const d = currentRecord.d;
	const h = currentRecord.h.concat([coordsStr]);

	const nextTo = [
		[coords[0] - 1, coords[1]] as const,
		[coords[0] + 1, coords[1]] as const,
		[coords[0], coords[1] - 1] as const,
		[coords[0], coords[1] + 1] as const,
	]
		.filter(([r, c]) => r >= 0 && r < rows && c >= 0 && c < cols)
		.filter(([r, c]) => map[r]![c] !== "#")
		.filter(([r, c]) => {
			const lp = longestPaths[r]![c];
			return lp === undefined || (lp.d < d + 1 && !h.includes(`${r}-${c}`));
		});

	for (const [r, c] of nextTo) {
		longestPaths[r]![c] = {
			d: d + 1,
			h,
		};
	}

	toCheck.push(...nextTo);
}

console.log(longestPaths[rows - 1]![endC]!.d);

console.log(
	map
		.map((row, r) =>
			row
				.map((x, c) =>
					r === 0 && c === startC
						? "S"
						: longestPaths[rows - 1]![endC]!.h.includes(`${r}-${c}`)
						? "O"
						: x
				)
				.join("")
		)
		.join("\n")
);
