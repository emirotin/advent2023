import { readLines, parseNums } from "../lib/index.js";

const map = readLines(import.meta.url, "input.txt")
	.map((l) => l.trim())
	.map((l) => parseNums(l, ""));

const rows = map.length;
const cols = map[0]!.length;

type Direction = "n" | "s" | "w" | "e" | "x";

type Vertex = {
	r: number;
	c: number;
	d: Direction;
	s: number;
};

const directions: Direction[] = ["n", "s", "w", "e"] as const;
const steps = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

const toStr = ({ r, c, d, s }: Vertex) => `${d}-${s}-${r}-${c}`;

const vertexes: string[] = [toStr({ r: 0, c: 0, d: "x", s: 0 })];
for (let r = 0; r < rows; r++) {
	for (let c = 0; c < cols; c++) {
		for (const d of directions) {
			for (const s of steps) {
				if (
					(d === "w" && c < cols - 1) ||
					(d === "e" && c > 0) ||
					(d === "n" && r < rows - 1) ||
					(d === "s" && r > 0)
				)
					vertexes.push(toStr({ r, c, d, s }));
			}
		}
	}
}

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

const fromStr = (v: string): Vertex => {
	const parts = v.split("-");
	const d = parts[0] as Direction;
	const s = parseInt(parts[1]!);
	const r = parseInt(parts[2]!);
	const c = parseInt(parts[3]!);

	return { r, c, d, s };
};

const memoize = <T>(fn: (v: string) => T): ((v: string) => T) => {
	const memo = new Map<string, T>();
	const wrapped = (v: string) => {
		if (memo.has(v)) return memo.get(v)!;
		const res = fn(v);
		memo.set(v, res);
		return res;
	};
	return wrapped;
};

const neighbors = memoize((v: string): string[] => {
	const { r, c, d, s } = fromStr(v);

	if (d === "x") {
		return [
			{ r: 0, c: 1, d: "e" as const, s: 1 },
			{ r: 1, c: 0, d: "s" as const, s: 1 },
		].map((v) => toStr(v));
	}

	const turnDirections =
		s < 4
			? []
			: ([
					(d === "w" || d === "e") && r >= 4 && "n",
					(d === "w" || d === "e") && r <= rows - 5 && "s",
					(d === "n" || d === "s") && c >= 4 && "w",
					(d === "n" || d === "s") && c <= cols - 5 && "e",
			  ].filter(Boolean) as Direction[]);

	const sameDirection =
		s >= 10
			? []
			: ([
					d === "w" && c > 0 && c >= 4 - s && "w",
					d === "e" && c < cols - 1 && c <= cols - 5 + s && "e",
					d === "n" && r > 0 && r >= 4 - s && "n",
					d === "s" && r < rows - 1 && r <= rows - 5 + s && "s",
			  ].filter(Boolean) as Direction[]);

	return [
		...turnDirections.map((d) => ({ r: r + dr[d], c: c + dc[d], d, s: 1 })),
		...sameDirection.map((d) => ({ r: r + dr[d], c: c + dc[d], d, s: s + 1 })),
	].map(toStr);
});

const edge = memoize((v: string) => {
	const { r, c } = fromStr(v);
	return map[r]![c]!;
});

// https://en.wikipedia.org/wiki/Shortest_path_faster_algorithm
const q: string[] = [];
const dist = new Map<string, number>();
for (const v of vertexes) {
	dist.set(v, Infinity);
}
const source = toStr({ r: 0, c: 0, d: "x", s: 0 });
dist.set(source, 0);
q.push(source);

while (q.length) {
	const u = q.shift()!;
	const d = dist.get(u)!;

	for (const v of neighbors(u)) {
		const alt = d + edge(v);
		if (alt < dist.get(v)!) {
			dist.set(v, alt);
			if (!q.includes(v)) {
				q.push(v);
			}
		}
	}
}

const isTarget = (v: string) => v.endsWith(`-${rows - 1}-${cols - 1}`);

const targets = vertexes.filter(isTarget);

console.log(Math.min(...targets.map((t) => dist.get(t)!)));
