import { readLines } from "../lib/index.js";

type Coords = readonly [number, number];

type MapUnit = ("." | "#" | number)[][];

const getData = () => {
	let start: Coords | null = null;

	const parseLine = (line: string, i: number) =>
		line.split("").map((ch, j) => {
			if (ch === "S") {
				start = [i, j];
				return ".";
			}
			return ch === "#" ? "#" : ".";
		});

	const map = readLines(import.meta.url, "input.txt")
		.map((l) => l.trim())
		.filter(Boolean)
		.map(parseLine);

	const rows = map.length;
	const cols = map[0]!.length;

	if (rows !== cols) throw new Error("Not square");
	if (rows % 2 === 0) throw new Error("Even side");
	if (!start) throw new Error("No start marker");
	if (start[0] !== (rows - 1) / 2 || start[0] !== start[1])
		throw new Error("Not centered");

	const size = rows;

	const sideRange = Array.from({ length: size }, (_, i) => i);
	if (
		!(
			sideRange.every((c) => map[0]![c] === ".") &&
			sideRange.every((c) => map[size - 1]![c] === ".") &&
			sideRange.every((r) => map[r]![0] === ".") &&
			sideRange.every((r) => map[r]![size - 1] === ".") &&
			sideRange.every((r) => map[r]![start![1]] === ".") &&
			sideRange.every((c) => map[start![0]]![c] === ".")
		)
	)
		throw new Error("Meh, my algo is hard-wired to these assumptions");

	return { map, size, start: start! };
};

const neighbors = (map: MapUnit, size: number, [r, c]: Coords) => {
	return [
		[r - 1, c] as const,
		[r + 1, c] as const,
		[r, c - 1] as const,
		[r, c + 1] as const,
	].filter(
		([r, c]) => r >= 0 && r < size && c >= 0 && c < size && map[r]![c] === "."
	);
};

const multiplyArray = <T>(arr: T[], n: number): T[] => {
	const size = arr.length;
	return Array.from({ length: size * n }, (_, i) =>
		structuredClone(arr[i % size]!)
	);
};

export const multiplyMap = (map: MapUnit, n: number) =>
	multiplyArray(
		map.map((r) => multiplyArray(r, n)),
		n
	);

export const sliceMap = (map: MapUnit, n: number) => {
	const size = map.length;
	const res = Array.from({ length: n }, () => Array.from({ length: n }));
	const partSize = size / n;
	for (let j = 0; j < n; j++) {
		for (let i = 0; i < n; i++) {
			res[j]![i] = map
				.slice(j * partSize, (j + 1) * partSize)
				.map((r) => r.slice(i * partSize, (i + 1) * partSize));
		}
	}
	return res as MapUnit[][];
};

export const calcPaths = (map: MapUnit, size: number, start: Coords) => {
	map[start[0]]![start[1]] = 0;
	const checkNext = [start];
	let coords: Coords | undefined;
	while ((coords = checkNext.shift())) {
		const n = map[coords[0]]![coords[1]] as number;
		for (const [r, c] of neighbors(map, size, coords)) {
			if (map[r]![c] === ".") {
				map[r]![c] = n + 1;
				checkNext.push([r, c]);
			}
		}
	}

	return map;
};

const calcStats = (map: MapUnit) => {
	const numbers = map
		.flatMap((r) => r)
		.filter((n) => typeof n === "number") as number[];
	const odds = numbers.filter((n) => n % 2 === 1).length;
	const evens = numbers.filter((n) => n % 2 === 0).length;
	const minPath = Math.min(...numbers);
	const maxPath = Math.max(...numbers);

	return {
		numbers,
		odds,
		evens,
		minPath,
		maxPath,
	};
};

type Stats = ReturnType<typeof calcStats>;

const TOTAL_STEPS = 26501365;

const MULT = 3;
const { map: originalMap, size, start: originalStart } = getData();
const start = [
	originalStart[0] + ((MULT - 1) / 2) * size,
	originalStart[1] + ((MULT - 1) / 2) * size,
] as const;

const extendedMap = multiplyMap(originalMap as MapUnit, MULT);
const extendedMapWithPaths = calcPaths(extendedMap, size * MULT, start);
const slicedMap = sliceMap(extendedMapWithPaths, MULT);
const stats = slicedMap.map((r) => r.map(calcStats));

let res = TOTAL_STEPS % 2 ? stats[1]![1]!.odds : stats[1]![1]!.evens;

const travelLine = (initialStepsLeft: number, stats: Stats) => {
	let stepsLeft = initialStepsLeft;

	if (stepsLeft > stats.maxPath) {
		const n = Math.floor((stepsLeft - stats.maxPath) / size);
		const oddNumsCount = Math.floor((n + 1) / 2);
		res +=
			(stepsLeft % 2 ? stats.odds : stats.evens) * oddNumsCount +
			(stepsLeft % 2 ? stats.evens : stats.odds) * (n - oddNumsCount);

		stepsLeft -= n * size;
	}

	while (stepsLeft >= stats.minPath) {
		if (stepsLeft >= stats.maxPath) {
			res += stepsLeft % 2 ? stats.odds : stats.evens;
		} else {
			res += stats.numbers.filter(
				(n) => n % 2 === stepsLeft % 2 && n <= stepsLeft
			).length;
		}
		stepsLeft -= size;
	}
};

const travelQuadrant = (stats: Stats) => {
	let stepsLeft = TOTAL_STEPS;
	while (stepsLeft > 0) {
		// traverse the vertical line starting from the current map
		travelLine(stepsLeft, stats);
		// travel one map further horizontally
		stepsLeft -= size;
	}
};

// go west (this is what we gonna do)
travelLine(TOTAL_STEPS, stats[1]![0]!);
// go east
travelLine(TOTAL_STEPS, stats[1]![2]!);
// go north
travelLine(TOTAL_STEPS, stats[0]![1]!);
// go south
travelLine(TOTAL_STEPS, stats[2]![1]!);

// travel north-east
travelQuadrant(stats[0]![2]!);
// travel north-west
travelQuadrant(stats[0]![0]!);
// travel south-east
travelQuadrant(stats[2]![0]!);
// travel south-west
travelQuadrant(stats[2]![2]!);

console.log(res);
