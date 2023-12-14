import { readLines } from "../lib/index.js";
import { type Char, parseLine, totalLoad } from "./lib.js";

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

console.log(totalLoad(map));
