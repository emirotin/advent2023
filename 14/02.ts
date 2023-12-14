import { readLines } from "../lib/index.js";
import { parseLine, totalLoad } from "./lib.js";

const map = readLines(import.meta.url, "input.txt")
	.map((s) => s.trim())
	.filter(Boolean)
	.map(parseLine);

const rows = map.length;
const cols = map[0]!.length;

const tiltNorth = () => {
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

const tiltSouth = () => {
	for (let c = 0; c < cols; c++) {
		for (let r = rows - 1; r >= 0; r--) {
			if (map[r]![c] !== "O") continue;

			let rs = r;
			while (rs < rows - 1 && map[rs + 1]![c] === ".") {
				rs += 1;
			}
			if (rs !== r) {
				map[rs]![c] = "O";
				map[r]![c] = ".";
			}
		}
	}
};

const tiltWest = () => {
	for (let r = 0; r < rows; r++) {
		for (let c = 0; c < cols; c++) {
			if (map[r]![c] !== "O") continue;

			let cw = c;
			while (cw > 0 && map[r]![cw - 1] === ".") {
				cw -= 1;
			}
			if (cw !== c) {
				map[r]![cw] = "O";
				map[r]![c] = ".";
			}
		}
	}
};

const tiltEast = () => {
	for (let r = 0; r < rows; r++) {
		for (let c = cols; c >= 0; c--) {
			if (map[r]![c] !== "O") continue;

			let ce = c;
			while (ce < cols - 1 && map[r]![ce + 1] === ".") {
				ce += 1;
			}
			if (ce !== c) {
				map[r]![ce] = "O";
				map[r]![c] = ".";
			}
		}
	}
};

const runCycle = () => {
	tiltNorth();
	tiltWest();
	tiltSouth();
	tiltEast();
};

const CYCLES = 1000000000;

const mapInvariant = () => map.map((r) => r.join("")).join("\n");
const parseMap = (s: string) => s.split("\n").map(parseLine);

const seenStates = [mapInvariant()];
let iter = 0;

while (true) {
	runCycle();
	iter += 1;
	const state = mapInvariant();
	let seenIndex = seenStates.indexOf(state);
	seenStates.push(state);

	if (seenIndex < 0) continue;

	const setup = seenIndex;
	const period = iter - seenIndex;

	const i = ((CYCLES - setup) % period) + setup;
	console.log(totalLoad(parseMap(seenStates[i]!)));
	break;
}
