import { readLines } from "../lib/index.js";

type Coords = readonly [number, number];

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

const { map, size, start } = getData();

const neighbors = ([r, c]: Coords) => {
	return [
		[r - 1, c] as const,
		[r + 1, c] as const,
		[r, c - 1] as const,
		[r, c + 1] as const,
	].filter(
		([r, c]) => r >= 0 && r < size && c >= 0 && c < size && map[r]![c] === "."
	);
};

const clonedMap = () => map.map((r) => r.slice() as ("." | "#" | number)[]);

const entryPoints = ["nw", "n", "ne", "e", "se", "s", "sw", "w"] as const;
type EntryPoint = (typeof entryPoints)[number];

const entryPointCoords: Record<EntryPoint, [number, number]> = {
	nw: [0, 0],
	n: [0, (size - 1) / 2],
	ne: [0, size - 1],
	e: [(size - 1) / 2, size - 1],
	se: [size - 1, size - 1],
	s: [size - 1, (size - 1) / 2],
	sw: [size - 1, 0],
	w: [(size - 1) / 2, 0],
};

const calcPaths = (map: ("." | "#" | number)[][], start: Coords) => {
	map[start[0]]![start[1]] = 0;
	const checkNext = [start];
	let coords: Coords | undefined;
	while ((coords = checkNext.shift())) {
		const n = map[coords[0]]![coords[1]] as number;
		for (const [r, c] of neighbors(coords)) {
			if (map[r]![c] === ".") {
				map[r]![c] = n + 1;
				checkNext.push([r, c]);
			}
		}
	}

	const numbers = map
		.flatMap((r) => r)
		.filter((n) => typeof n === "number") as number[];
	const odds = numbers.filter((n) => n % 2 === 1).length;
	const evens = numbers.filter((n) => n % 2 === 0).length;
	const maxPath = Math.max(...numbers);

	return {
		map: map as ("#" | number)[][],
		numbers,
		odds,
		evens,
		maxPath,
	};
};

type PathInfo = ReturnType<typeof calcPaths>;

const entryModels = Object.fromEntries(
	entryPoints.map((code) => {
		const mapCopy = clonedMap();
		const start = entryPointCoords[code];

		return [code, calcPaths(mapCopy, start)];
	})
) as Record<EntryPoint, PathInfo>;

const originalPaths = calcPaths(clonedMap(), start);

const TOTAL_STEPS = 26501365;

let res = TOTAL_STEPS % 2 ? originalPaths.odds : originalPaths.evens;

const travelLine = (initialStepsLeft: number, entryPoint: EntryPoint) => {
	const path = entryModels[entryPoint];
	let stepsLeft = initialStepsLeft;
	const n = Math.floor((stepsLeft - path.maxPath) / size);
	const oddNumsCount = Math.floor((n + 1) / 2);
	res +=
		(stepsLeft % 2 ? path.odds : path.evens) * oddNumsCount +
		(stepsLeft % 2 ? path.evens : path.odds) * (n - oddNumsCount);

	stepsLeft -= n * size;
	while (stepsLeft > 0) {
		if (stepsLeft >= path.maxPath) {
			res += stepsLeft % 2 ? path.odds : path.evens;
		} else {
			res += path.numbers.filter(
				(n) => n % 2 === stepsLeft % 2 && n <= stepsLeft
			).length;
		}
		stepsLeft -= size;
	}
};

const travelQuadrant = (entryPoint: EntryPoint) => {
	// steps to get to the first map instance, closest diagonal square
	let stepsLeft = TOTAL_STEPS - (size + 1);
	while (stepsLeft > 0) {
		// traverse the vertical line starting from the current map
		travelLine(stepsLeft, entryPoint);
		// travel one map further "horizontally"
		stepsLeft -= size;
	}
};

// go east
travelLine(TOTAL_STEPS - (size + 1) / 2, "w");
// go west (yeah)
travelLine(TOTAL_STEPS - (size + 1) / 2, "e");
// go north
travelLine(TOTAL_STEPS - (size + 1) / 2, "s");
// go south
travelLine(TOTAL_STEPS - (size + 1) / 2, "n");

// travel north-east
travelQuadrant("sw");
// travel north-west
travelQuadrant("se");
// travel south-east
travelQuadrant("nw");
// travel south-west
travelQuadrant("ne");

console.log(res);
