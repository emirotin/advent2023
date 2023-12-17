import { readLines, parseNums, sum } from "../lib/index.js";

const map = readLines(import.meta.url, "demo.txt")
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
const steps = [1, 2, 3] as const;

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

	const turnDirections = [
		(d === "w" || d === "e" || d === "x") && r > 0 && "n",
		(d === "w" || d === "e" || d === "x") && r < rows - 1 && "s",
		(d === "n" || d === "s" || d === "x") && c > 0 && "w",
		(d === "n" || d === "s" || d === "x") && c < cols - 1 && "e",
	].filter(Boolean) as Direction[];

	const sameDirection =
		s >= 3
			? []
			: ([
					d === "w" && c > 0 && "w",
					d === "e" && c < cols - 1 && "e",
					d === "n" && r > 0 && "n",
					d === "s" && r < rows - 1 && "s",
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

const q: string[] = [];
const dist = new Map<string, number>();
const prev = new Map<string, string | undefined>();
for (const v of vertexes) {
	dist.set(v, Infinity);
	prev.set(v, undefined);
	q.push(v);
}
const source = toStr({ r: 0, c: 0, d: "x", s: 0 });
dist.set(source, 0);

const isTarget = (v: string) => v.endsWith(`-${rows - 1}-${cols - 1}`);

const start = Date.now();

while (q.length) {
	if (q.length % 1000 === 0) {
		console.log((Date.now() - start) / 1000);
	}
	const targets = q.filter(isTarget);
	if (!targets.length) break;

	const candidates = q
		.map((v) => [dist.get(v)!, v] as const)
		.sort(([a], [b]) => a - b);
	const [d, u] = candidates[0]!;

	const i = q.indexOf(u);
	q.splice(i, 1);

	for (const v of neighbors(u)) {
		if (!q.includes(v)) continue;
		const alt = d + edge(v);
		if (alt < dist.get(v)!) {
			dist.set(v, alt);
			prev.set(v, u);
		}
	}
}

const targets = vertexes.filter(isTarget);

console.log(Math.min(...targets.map((t) => dist.get(t)!)));
