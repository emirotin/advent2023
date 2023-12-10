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

const matrix = readLines(import.meta.url, "demo5.txt")
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
	newMatrix[startR]![startC] = startPipe;

	for (let r = 0; r < rows; r++) {
		for (let c = 0; c < cols; c++) {
			if (!loopCoords.find((coord) => coord.r === r && coord.c === c)) {
				newMatrix[r]![c] = ".";
			}
		}
	}

	return newMatrix as MapChar[][];
};

const countInnerCells = (matrix: (MapChar | "x" | "I" | "O")[][]) => {
	let count = 0;

	for (let r = 0; r < rows; r++) {
		let isBetweenPipes = 0;
		for (let c = 0; c < cols; c++) {
			if (matrix[r]![c] === ".") {
				matrix[r]![c] = isBetweenPipes ? "x" : "O";
			} else if (["|", "L", "F", "J", "7"].includes(matrix[r]![c]!)) {
				isBetweenPipes = 1 - isBetweenPipes;
			}
		}
	}

	for (let c = 0; c < cols; c++) {
		let isBetweenPipes = 0;
		for (let r = 0; r < rows; r++) {
			if (matrix[r]![c] === "x") {
				matrix[r]![c] = isBetweenPipes ? "I" : "O";
			} else if (["-", "L", "F", "J", "7"].includes(matrix[r]![c]!)) {
				isBetweenPipes = 1 - isBetweenPipes;
			}
		}
	}

	console.log(
		matrix.reduce<number>((acc, r) => {
			acc += r.reduce<number>((acc, c) => {
				return acc + (c === "I" ? 1 : 0);
			}, 0);
			return acc;
		}, 0)
	);

	return matrix;
};

const printMatrix = (matrix: string[][]) =>
	console.log(matrix.map((r) => r.join("")).join("\n"));

possibleStartPipes.forEach((pipe) => {
	printMatrix(countInnerCells(findLoop(matrix, startR, startC, pipe)));
});
