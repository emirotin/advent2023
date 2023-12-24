import { readLines } from "../lib/index.js";

const parseLine = (line: string, i: number) =>
	line.split("").map((c) => (c === "#" ? "#" : "."));

const map = readLines(import.meta.url, "input.txt")
	.map((l) => l.trim())
	.filter(Boolean)
	.map(parseLine);

const rows = map.length;
const cols = map[0]!.length;

const startC = map[0]!.findIndex((c) => c === ".");
const endC = map[rows - 1]!.findIndex((c) => c === ".");

function* getVertexes() {
	for (let r = 0; r < rows; r++) {
		for (let c = 0; c < cols; c++) {
			if (map[r]![c] === ".") yield [r, c];
		}
	}
}

const vertexes = [...getVertexes()];

type Vertex = { id: string; r: number; c: number; ns: Array<[string, number]> };

const vs: Record<string, Vertex> = Object.fromEntries(
	vertexes.map(([r, c]) => {
		const id = `${r}-${c}`;

		const neighbors = [
			[r! - 1, c!] as const,
			[r! + 1, c!] as const,
			[r!, c! - 1] as const,
			[r!, c! + 1] as const,
		]
			.filter(([r, c]) => r >= 0 && r < rows && c > 0 && c < cols)
			.filter(([r, c]) => map[r]![c] !== "#")
			.map(([r, c]) => `${r}-${c}`);

		return [id, { id, r: r!, c: c!, ns: neighbors.map((id) => [id, 1]) }];
	})
);

let res = 0;
let start = vs[`0-${startC}`]!;
while (start.ns.length === 1) {
	res += 1;
	const oldId = start.id;
	delete vs[oldId];
	start = vs[start.ns[0]![0]!]!;
	start.ns = start.ns.filter(([id]) => id !== oldId);
}

let end = vs[`${rows - 1}-${endC}`]!;
while (end.ns.length === 1) {
	res += 1;
	const oldId = end.id;
	delete vs[oldId];
	end = vs[end.ns[0]![0]!]!;
	end.ns = end.ns.filter(([id]) => id !== oldId);
}

let vToRemove: Vertex | undefined;
while (
	(vToRemove = Object.values(vs).find(
		(v) => v.ns.length === 2 && v.id !== start.id && v.id !== end.id
	))
) {
	const n1 = vToRemove.ns[0]!;
	const n2 = vToRemove.ns[1]!;
	const d = n1[1] + n2[1];
	vs[n1[0]]!.ns = vs[n1[0]]!.ns.filter(([id]) => id !== vToRemove!.id).concat([
		[n2[0], d],
	]);
	vs[n2[0]]!.ns = vs[n2[0]]!.ns.filter(([id]) => id !== vToRemove!.id).concat([
		[n1[0], d],
	]);
	delete vs[vToRemove.id];
}

const longestPath = (endNodeId: string, history: string[]): number => {
	if (endNodeId === start.id) return 0;

	const comingFrom = vs[endNodeId]!.ns.filter(([id]) => !history.includes(id));
	const candidates = comingFrom.map(
		([id, d]) => d + longestPath(id, [...history, endNodeId])
	);

	return Math.max(...candidates);
};

console.log(longestPath(end.id, []) + res);
