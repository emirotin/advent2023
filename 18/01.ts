import { readLines, parseNums, sum } from "../lib/index.js";

type Direction = "n" | "s" | "w" | "e";
type InputDir = "U" | "D" | "L" | "R";
type Turn = "nw" | "ne" | "sw" | "se" | "wn" | "ws" | "en" | "es";
type MapChar = "." | "L" | "J" | "7" | "F" | "|" | "-";

type Instruction = {
	d: Direction;
	n: number;
};

const charToDirection: Record<InputDir, Direction> = {
	U: "n",
	D: "s",
	L: "w",
	R: "e",
};

const parseInstr = (s: string): Instruction => {
	const parts = s.split(" ");
	return {
		d: charToDirection[parts[0] as InputDir],
		n: parseInt(parts[1]!),
	};
};

const instructions = readLines(import.meta.url, "input.txt")
	.map((l) => l.trim())
	.filter(Boolean)
	.map(parseInstr);

const turns: Turn[] = [];

for (let i = 1; i <= instructions.length; i++) {
	const current = instructions[i % instructions.length]!;
	const prev = instructions[i - 1]!;
	const turn = (prev.d + current.d) as Turn;

	turns.push(turn);
}

const turnToChar: Record<Turn, MapChar> = {
	en: "J",
	es: "7",
	ne: "F",
	nw: "7",
	wn: "L",
	ws: "F",
	se: "L",
	sw: "J",
};

const map: MapChar[][] = [[]];
let rows = 1;
let cols = 1;

const expand = (d: Direction) => {
	switch (d) {
		case "n":
			map.unshift(Array.from({ length: cols }).fill(".") as MapChar[]);
			rows += 1;
			return;
		case "s":
			map.push(Array.from({ length: cols }).fill(".") as MapChar[]);
			rows += 1;
			return;
		case "w":
			map.forEach((row) => {
				row.unshift(".");
			});
			cols += 1;
			return;
		case "e":
			map.forEach((row) => {
				row.push(".");
			});
			cols += 1;
			return;
	}
};

const drawBorders = () => {
	let r = 0;
	let c = 0;
	for (let { d, n } of instructions) {
		while (n) {
			switch (d) {
				case "n":
					r -= 1;
					if (r < 0) {
						expand("n");
						r = 0;
					}
					break;
				case "s":
					r += 1;
					if (r >= rows) {
						expand("s");
						r = rows - 1;
					}
					break;
				case "w":
					c -= 1;
					if (c < 0) {
						expand("w");
						c = 0;
					}
					break;
				case "e":
					c += 1;
					if (c >= cols) {
						expand("e");
						c = cols - 1;
					}
					break;
			}
			map[r]![c] = d === "n" || d === "s" ? "|" : "-";
			n -= 1;
		}
		const turn = turns.shift()!;
		map[r]![c] = turnToChar[turn];
	}

	expand("n");
	expand("s");
	expand("w");
	expand("e");
};

drawBorders();

// straight outta day 10 p.2
const countInnerCells = (matrix: (MapChar | "?" | "I" | "O")[][]) => {
	let count = 0;

	for (let r = 0; r < rows * 2; r++) {
		let isBetweenPipes = 0;
		for (let c = 0; c < cols * 2; c++) {
			const sym = matrix[~~(r / 2)]![~~(c / 2)]!;

			if (sym === ".") {
				matrix[~~(r / 2)]![~~(c / 2)] = isBetweenPipes ? "?" : "O";
			} else if (
				(c % 2 === 0 && sym === "|") ||
				(r % 2 === 1 && c % 2 === 0 && sym === "F") ||
				(r % 2 === 0 && c % 2 === 0 && sym === "L") ||
				(r % 2 === 1 && c % 2 === 0 && sym === "7") ||
				(r % 2 === 0 && c % 2 === 0 && sym === "J")
			) {
				isBetweenPipes = 1 - isBetweenPipes;
			}
		}
	}

	for (let c = 0; c < cols * 2; c++) {
		let isBetweenPipes = 0;
		for (let r = 0; r < rows * 2; r++) {
			const sym = matrix[~~(r / 2)]![~~(c / 2)]!;

			if (sym === "?") {
				matrix[~~(r / 2)]![~~(c / 2)] = isBetweenPipes ? "I" : "O";
				count += isBetweenPipes;
			} else if (
				(r % 2 === 0 && sym === "-") ||
				(r % 2 === 0 && c % 2 === 1 && sym === "F") ||
				(r % 2 === 0 && c % 2 === 1 && sym === "L") ||
				(r % 2 === 0 && c % 2 === 0 && sym === "7") ||
				(r % 2 === 0 && c % 2 === 0 && sym === "J")
			) {
				isBetweenPipes = 1 - isBetweenPipes;
			}
		}
	}

	return count;
};

console.log(countInnerCells(map) + sum(instructions.map(({ n }) => n)));
