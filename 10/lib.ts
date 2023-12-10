export type PipeChar = "-" | "|" | "F" | "L" | "7" | "J";
export type MapChar = PipeChar | ".";
export type InputChar = MapChar | "S";

export const parseLine = (line: string) => line.trim().split("") as InputChar[];

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

export const findPossiblePipes = (
	matrix: InputChar[][],
	rows: number,
	cols: number,
	r: number,
	c: number
) =>
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

export const findStart = (matrix: InputChar[][]) => {
	const r = matrix.findIndex((row) => row.includes("S"));
	const c = matrix[r]!.findIndex((v) => v === "S");

	return { r, c };
};

export const possibleSteps = {
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
