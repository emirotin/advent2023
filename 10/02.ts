import { readLines } from "../lib/index.js";
import {
	type PipeChar,
	findPossiblePipes,
	findStart,
	parseLine,
	possibleSteps,
	type InputChar,
	MapChar,
} from "./lib.js";

const matrix = readLines(import.meta.url, "input.txt")
	.map((l) => l.trim())
	.filter(Boolean)
	.map(parseLine);

const rows = matrix.length;
const cols = matrix[0]!.length;

const { r: startR, c: startC } = findStart(matrix);

const possibleStartPipes = findPossiblePipes(
	matrix,
	rows,
	cols,
	startR,
	startC
);

const cloneMatrix = (matrix: InputChar[][]) => matrix.map((row) => row.slice());

const findLoop = (
	matrix: InputChar[][],
	startR: number,
	startC: number,
	startPipe: PipeChar
) => {
	const loopCoords: Array<{ r: number; c: number }> = [];

	let currR = startR;
	let currC = startC;
	let currPipe = startPipe;
	let prevR: number | null = null;
	let prevC: number | null = null;

	while (true) {
		loopCoords.push({ r: currR, c: currC });

		const nextCandidates = possibleSteps[currPipe]!.map(({ r, c }) => ({
			r: r + currR,
			c: c + currC,
		}));

		const nextCell = nextCandidates.filter(
			({ r, c }) => r !== prevR || c !== prevC
		)[0]!;
		prevR = currR;
		prevC = currC;
		currR = nextCell.r;
		currC = nextCell.c;
		currPipe = matrix[currR]![currC]! as PipeChar;

		if (matrix[currR]![currC!] === "S") break;
	}

	const newMatrix = cloneMatrix(matrix);
	// replace start symbol with the actual pipe
	newMatrix[startR]![startC] = startPipe;

	// replace all pipes that are not part of the loop
	for (let r = 0; r < rows; r++) {
		for (let c = 0; c < cols; c++) {
			if (!loopCoords.find((coord) => coord.r === r && coord.c === c)) {
				newMatrix[r]![c] = ".";
			}
		}
	}

	return newMatrix as MapChar[][];
};

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

// const printMatrix = (matrix: string[][]) =>
// 	console.log(matrix.map((r) => r.join("")).join("\n"));

possibleStartPipes.forEach((pipe) => {
	console.log(countInnerCells(findLoop(matrix, startR, startC, pipe)));
});
