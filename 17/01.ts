import { readLines, parseNums } from "../lib/index.js";

const map = readLines(import.meta.url, "demo.txt")
	.map((l) => l.trim())
	.map((l) => parseNums(l, ""));

const rows = map.length;
const cols = map[0]!.length;

const globalHistory = new Map<string, number>();

type Direction = "n" | "s" | "w" | "e" | "x";

const dr: Record<Direction, number> = {
	n: -1,
	s: 1,
	w: 0,
	e: 0,
	x: Infinity,
} as const;

const dc: Record<Direction, number> = {
	n: 0,
	s: 0,
	w: -1,
	e: 1,
	x: Infinity,
} as const;

const findMinAux = (
	r: number,
	c: number,
	d: Direction,
	lastStreakLength: number = 0,
	history: string[] = []
): number => {
	history = [...history, `${r}-${c}`];

	const v = map[r]![c]!;

	if (r === rows - 1 && c === cols - 1) {
		return v;
	}

	const key = `${d}(${lastStreakLength})=>${r}-${c}`;
	if (globalHistory.has(key)) {
		return globalHistory.get(key)!;
	}

	const turnDirections = [
		(d === "w" || d === "e" || d === "x") && r > 0 && "n",
		(d === "w" || d === "e" || d === "x") && r < rows - 1 && "s",
		(d === "n" || d === "s" || d === "x") && c > 0 && "w",
		(d === "n" || d === "s" || d === "x") && c < cols - 1 && "e",
	].filter(Boolean) as Direction[];

	const sameDirection =
		lastStreakLength >= 3
			? []
			: ([
					d === "w" && c > 0 && "w",
					d === "e" && c < cols - 1 && "e",
					d === "n" && r > 0 && "n",
					d === "s" && r < rows - 1 && "s",
			  ].filter(Boolean) as Direction[]);

	const nextTurns = [
		...turnDirections.map((d) => [r + dr[d], c + dc[d], d, 1] as const),
		...sameDirection.map(
			(d) => [r + dr[d], c + dc[d], d, lastStreakLength + 1] as const
		),
	].filter(([r, c]) => !history.includes(`${r}-${c}`));

	if (nextTurns.length === 0) {
		return Infinity;
	}

	const res =
		Math.min(
			...nextTurns.map(([r, c, d, s]) => findMinAux(r, c, d, s, history))
		) + v;

	globalHistory.set(key, res);

	return res;
};

const findMin = (r: number, c: number) => {
	return findMinAux(r, c, "x") - map[r]![c]!;
};

console.log(findMin(0, 0));
