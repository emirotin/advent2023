import { readLines, sum, uniq } from "../lib/index.js";

const lines = readLines(import.meta.url, "input.txt")
	.map((l) => l.trim())
	.filter(Boolean);

const gear = Symbol("gear");

const parseLine = (line: string) =>
	line.split("").map((c) => {
		if (c.match(/\d/)) return parseInt(c);
		if (c === "*") return gear;
		return null;
	});

type Matrix = Array<Array<number | null | typeof gear>>;

const matrix = lines.map(parseLine) satisfies Matrix;

const rowsCnt = matrix.length;
const columnsCnt = matrix[0]!.length;

function* findAdjacentGears(r: number, c: number) {
	if (r > 0 && c > 0 && matrix[r - 1]![c - 1] === gear)
		yield { r: r - 1, c: c - 1 };
	if (r > 0 && matrix[r - 1]![c] === gear) yield { r: r - 1, c };
	if (r > 0 && c < columnsCnt - 1 && matrix[r - 1]![c + 1] === gear)
		yield { r: r - 1, c: c + 1 };
	if (c > 0 && matrix[r]![c - 1] === gear) yield { r, c: c - 1 };
	if (c < columnsCnt - 1 && matrix[r]![c + 1] === gear) yield { r, c: c + 1 };
	if (r < rowsCnt - 1 && c > 0 && matrix[r + 1]![c - 1] === gear)
		yield { r: r + 1, c: c - 1 };
	if (r < rowsCnt - 1 && matrix[r + 1]![c] === gear) yield { r: r + 1, c };
	if (r < rowsCnt - 1 && c < columnsCnt - 1 && matrix[r + 1]![c + 1] === gear)
		yield { r: r + 1, c: c + 1 };
}

const adjustedMatrix = matrix.map((row, r) =>
	row.map((el, c) => ({
		adjGears: typeof el === "number" ? [...findAdjacentGears(r, c)] : [],
		d: typeof el === "number" ? el : null,
	}))
);

type MarkedDigit = (typeof adjustedMatrix)[number][number];

const collectNumbers = (row: MarkedDigit[]) => {
	const result: Array<{
		n: number;
		adjGears: string[];
	}> = [];
	let currNumber = 0;
	let adjGears: Array<{ r: number; c: number }> = [];
	let state: "in" | "out" = "out";

	row = [...row, { d: null, adjGears: [] }];

	for (let i = 0; i <= columnsCnt; i++) {
		if (state === "out") {
			if (row[i]!.d !== null) {
				state = "in";
				currNumber = row[i]!.d!;
				adjGears = [...row[i]!.adjGears];
			} else {
				continue;
			}
		} else {
			if (row[i]!.d !== null) {
				currNumber = currNumber * 10 + row[i]!.d!;
				adjGears.push(...row[i]!.adjGears);
			} else {
				if (currNumber && adjGears.length) {
					result.push({
						n: currNumber,
						adjGears: uniq(adjGears.map(({ r, c }) => `${r}-${c}`)),
					});
				}
				state = "out";
			}
		}
	}

	return result;
};

const numbersWithGears = adjustedMatrix.flatMap(collectNumbers);

const gearsWithNumbers = numbersWithGears.reduce<Record<string, number[]>>(
	(acc, { n, adjGears }) => {
		adjGears.forEach((gear) => {
			if (acc[gear]) {
				acc[gear]!.push(n);
			} else {
				acc[gear] = [n];
			}
		});
		return acc;
	},
	{}
);

console.log(
	sum(
		Object.values(gearsWithNumbers)
			.filter((ns) => ns.length === 2)
			.map((ns) => ns[0]! * ns[1]!)
	)
);
