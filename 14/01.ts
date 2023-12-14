import { readLines, sum } from "../lib/index.js";

type Char = "." | "O" | "#";

const parseLine = (line: string) => line.split("") as Char[];

const map = readLines(import.meta.url, "input.txt")
	.map((s) => s.trim())
	.filter(Boolean)
	.map(parseLine);

const tiltNorth = (map: Char[][]) => {
	const rows = map.length;
	const cols = map[0]!.length;

	for (let c = 0; c < cols; c++) {
		for (let r = 0; r < rows; r++) {
			if (map[r]![c] !== "O") continue;

			let rn = r;
			while (rn > 0 && map[rn - 1]![c] === ".") {
				rn -= 1;
			}
			if (rn !== r) {
				map[rn]![c] = "O";
				map[r]![c] = ".";
			}
		}
	}
};

tiltNorth(map);

const rows = map.length;

console.log(
	sum(
		map.map((row, i) => (rows - i) * sum(row.map((c) => (c === "O" ? 1 : 0))))
	)
);
