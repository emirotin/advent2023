import { readLines } from "../lib/index.js";

type Char = "." | "#";

const range = (n: number) => Array.from({ length: n }, (_, i) => i);

const isEmpty = (arr: Char[]) => arr.every((c) => c === ".");

const expandMatrix = (matrix: Char[][]) => {
	let rows = matrix.length;
	let cols = matrix[0]!.length;

	let r = 0;
	while (r < rows) {
		if (isEmpty(matrix[r]!)) {
			matrix.splice(r, 0, Array.from({ length: cols }).fill(".") as "."[]);
			rows += 1;
			r += 1;
		}
		r += 1;
	}

	let c = 0;
	while (c < cols) {
		if (isEmpty(range(rows).map((r) => matrix[r]![c]!))) {
			matrix.forEach((row) => row.splice(c, 0, "."));
			cols += 1;
			c += 1;
		}
		c += 1;
	}
};

// const printMatrix = (matrix: string[][]) => {
// 	console.log(matrix.map((r) => r.join("")).join("\n"));
// };

const parseLine = (line: string) => line.trim().split("") as Char[];

const matrix = readLines(import.meta.url, "input.txt")
	.map((l) => l.trim())
	.filter(Boolean)
	.map(parseLine);

expandMatrix(matrix);

type Coords = { r: number; c: number };

function* findGalaxies(matrix: Char[][]): Generator<Coords> {
	let rows = matrix.length;
	let cols = matrix[0]!.length;

	for (let r = 0; r < rows; r++) {
		for (let c = 0; c < cols; c++) {
			if (matrix[r]![c]! === "#") {
				yield { r, c };
			}
		}
	}
}

const galaxies = [...findGalaxies(matrix)];

const dist = (p1: Coords, p2: Coords) =>
	Math.abs(p1.r - p2.r) + Math.abs(p1.c - p2.c);

let res = 0;
for (let i = 0; i < galaxies.length - 1; i++) {
	for (let j = i + 1; j < galaxies.length; j++) {
		res += dist(galaxies[i]!, galaxies[j]!);
	}
}

console.log(res);
