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

const vertexes: Vertex[] = [{ r: 0, c: 0, d: "x", s: 0 }];
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
					vertexes.push({ r, c, d, s });
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

const neighbors = (v: Vertex): Vertex[] => {
	const { r, c, d, s } = v;

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
	].map(getVertex);
};

const getVertex = (v: Vertex) =>
	vertexes.find(
		(u) => u.r === v.r && u.c === v.c && u.d === v.d && u.s === v.s
	)!;

const edge = (v1: Vertex, v2: Vertex) => {
	return map[v2.r]![v2.c]!;
};

const q: Vertex[] = [];
const dist = new Map<Vertex, number>();
const prev = new Map<Vertex, Vertex | undefined>();
for (const v of vertexes) {
	dist.set(v, Infinity);
	prev.set(v, undefined);
	q.push(v);
}
const source = getVertex({ r: 0, c: 0, d: "x", s: 0 });
dist.set(source, 0);

while (q.length) {
	const candidates = q
		.map((v) => [dist.get(v)!, v] as const)
		.sort(([a], [b]) => a - b);
	const [d, u] = candidates[0]!;
	const i = q.indexOf(u);
	q.splice(i, 1);

	for (const v of neighbors(u)) {
		if (!q.includes(v)) continue;
		const alt = d + edge(u, v);
		if (alt < dist.get(v)!) {
			dist.set(v, alt);
			prev.set(v, u);
		}
	}
}

const targets = vertexes.filter((v) => v.r === rows - 1 && v.c === cols - 1);

const paths = targets.map((t) => {
	const s: Vertex[] = [];
	let u = t;

	if (prev.get(u) || u === source) {
		while (u) {
			s.unshift(u);
			u = prev.get(u)!;
		}
	}

	return s;
});

console.log(
	Math.min(...paths.map((p) => sum(p.slice(1).map(({ r, c }) => map[r]![c]!))))
);
