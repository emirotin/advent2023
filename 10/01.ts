import { readLines } from "../lib/index.js";
import {
	type PipeChar,
	findPossiblePipes,
	findStart,
	parseLine,
	possibleSteps,
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

const findLoop = (startPipe: PipeChar) => {
	let currR = startR;
	let currC = startC;
	let currPipe = startPipe;
	let steps = 0;
	let prevR: number | null = null;
	let prevC: number | null = null;

	while (true) {
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
		steps += 1;

		if (matrix[currR]![currC!] === "S") break;
	}

	return steps;
};

const longestLoop = Math.max(...possibleStartPipes.map(findLoop));

console.log(Math.ceil(longestLoop / 2));
