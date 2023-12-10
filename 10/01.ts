import { readLines } from "../lib/index.js";

type PipeChar = "-" | "|" | "F" | "L" | "7" | "J";
type MapChar = PipeChar | ".";
type InputChar = MapChar | "S";

const parseLine = (line: string) => line.trim().split("") as InputChar[];

const matrix = readLines(import.meta.url, "input.txt")
	.map((l) => l.trim())
	.filter(Boolean)
	.map(parseLine);

const rows = matrix.length;
const cols = matrix[0]!.length;

const leftHoriz = ["-", "L", "F"] as const satisfies InputChar[];
const rightHoriz = ["-", "J", "7"] as const satisfies InputChar[];
const topVert = ["|", "F", "7"] as const satisfies InputChar[];
const bottomVert = ["|", "L", "J"] as const satisfies InputChar[];

type RequiredNeighbors = {
	left?: MapChar[];
	right?: MapChar[];
	top?: MapChar[];
	bottom?: MapChar[];
};

const requiredNeighbors = {
	"-": { left: leftHoriz, right: rightHoriz } satisfies RequiredNeighbors,
	"|": { top: topVert, bottom: bottomVert } satisfies RequiredNeighbors,
	F: { bottom: bottomVert, right: rightHoriz } satisfies RequiredNeighbors,
	L: { top: topVert, right: rightHoriz } satisfies RequiredNeighbors,
	J: { top: topVert, left: leftHoriz } satisfies RequiredNeighbors,
	"7": { bottom: bottomVert, left: leftHoriz } satisfies RequiredNeighbors,
} as const satisfies Record<PipeChar, RequiredNeighbors>;

const findPossiblePipes = (r: number, c: number) =>
	(Object.keys(requiredNeighbors) as PipeChar[]).filter((pipe) => {
		const leftChar = c > 0 ? matrix[r]![c - 1]! : ".";
		const rightChar = c < cols - 1 ? matrix[r]![c + 1]! : ".";
		const topChar = r > 0 ? matrix[r - 1]![c]! : ".";
		const bottomChar = r < rows - 1 ? matrix[r + 1]![c]! : ".";

		const rn = requiredNeighbors[pipe];

		return (
			(!("left" in rn) || (rn.left as InputChar[]).includes(leftChar)) &&
			(!("right" in rn) || (rn.right as InputChar[]).includes(rightChar)) &&
			(!("top" in rn) || (rn.top as InputChar[]).includes(topChar)) &&
			(!("bottom" in rn) || (rn.bottom as InputChar[]).includes(bottomChar))
		);
	});

const findStart = () => {
	const r = matrix.findIndex((row) => row.includes("S"));
	const c = matrix[r]!.findIndex((v) => v === "S");

	return { r, c };
};

const { r: startR, c: startC } = findStart();

const possibleStartPipes = findPossiblePipes(startR, startC);

const possibleSteps = {
	"-": [
		{ r: 0, c: -1 },
		{ r: 0, c: 1 },
	],
	"|": [
		{ r: -1, c: 0 },
		{ r: 1, c: 0 },
	],
	L: [
		{ r: -1, c: 0 },
		{ r: 0, c: 1 },
	],
	J: [
		{ r: -1, c: 0 },
		{ r: 0, c: -1 },
	],
	"7": [
		{ r: 0, c: -1 },
		{ r: 1, c: 0 },
	],
	F: [
		{ r: 1, c: 0 },
		{ r: 0, c: 1 },
	],
} as const;

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
