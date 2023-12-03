import { readLines, sum } from "../lib/index.js";

const lines = readLines(import.meta.url, "input.txt")
	.map((l) => l.trim())
	.filter(Boolean);

const sym = Symbol("sym");

const parseLine = (line: string) =>
	line.split("").map((c) => {
		if (c.match(/\d/)) return parseInt(c);
		if (c === ".") return null;
		return sym;
	});

type Matrix = Array<Array<number | null | typeof sym>>;

const matrix = lines.map(parseLine) satisfies Matrix;

const rowsCnt = matrix.length;
const columnsCnt = matrix[0]!.length;

const hasAdjacentSymbol = (r: number, c: number) =>
	(r > 0 && c > 0 && matrix[r - 1]![c - 1] === sym) ||
	(r > 0 && matrix[r - 1]![c] === sym) ||
	(r > 0 && c < columnsCnt - 1 && matrix[r - 1]![c + 1] === sym) ||
	(c > 0 && matrix[r]![c - 1] === sym) ||
	(c < columnsCnt - 1 && matrix[r]![c + 1] === sym) ||
	(r < rowsCnt - 1 && c > 0 && matrix[r + 1]![c - 1] === sym) ||
	(r < rowsCnt - 1 && matrix[r + 1]![c] === sym) ||
	(r < rowsCnt - 1 && c < columnsCnt - 1 && matrix[r + 1]![c + 1] === sym);

const adjustedMatrix = matrix.map((row, r) =>
	row.map((el, c) => ({
		adjToSym: typeof el === "number" && hasAdjacentSymbol(r, c),
		d: typeof el === "number" ? el : null,
	}))
);

type MarkedDigit = (typeof adjustedMatrix)[number][number];

const collectNumbers = (row: MarkedDigit[]): number[] => {
	const result: number[] = [];
	let currNumber = 0;
	let adjToSym = false;
	let state: "in" | "out" = "out";

	row = [...row, { d: null, adjToSym: false }];

	for (let i = 0; i <= columnsCnt; i++) {
		if (state === "out") {
			if (row[i]!.d !== null) {
				state = "in";
				currNumber = row[i]!.d!;
				adjToSym = row[i]!.adjToSym;
			} else {
				continue;
			}
		} else {
			if (row[i]!.d !== null) {
				currNumber = currNumber * 10 + row[i]!.d!;
				adjToSym ||= row[i]!.adjToSym;
			} else {
				if (currNumber && adjToSym) {
					result.push(currNumber);
				}
				state = "out";
			}
		}
	}

	return result;
};

console.log(sum(adjustedMatrix.flatMap(collectNumbers)));
