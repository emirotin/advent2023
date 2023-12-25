import fs from "fs";
import { getGraph } from "./lib.js";
import { isNotUndefined } from "../lib/index.js";

const { vertexes, adjacency } = getGraph(import.meta.url, "input.txt");

const neighbors = (v: string) => {
	const i = vertexes.indexOf(v);
	if (i < 0) return [];
	return adjacency[i]!.map((_, j) =>
		adjacency[i]![j] ? vertexes[j] : undefined
	).filter(isNotUndefined);
};

// obtained via visually exploring the result of plot.py :-P
const EDGES_TO_REMOVE = ["vps-pzc", "dph-cvx", "xvk-sgc"];

for (const edge of EDGES_TO_REMOVE) {
	const [from, to] = edge.split("-");
	const i = vertexes.indexOf(from!);
	const j = vertexes.indexOf(to!);
	adjacency[i]![j] = 0;
	adjacency[j]![i] = 0;
}

const n = vertexes.length;
const vMinus = new Set<string>();
const checkNext = [vertexes[0]!];

while (checkNext.length) {
	const v = checkNext.shift()!;
	vMinus.add(v);
	checkNext.push(...neighbors(v).filter((u) => !vMinus.has(u)));
}

console.log(vMinus.size * (n - vMinus.size));
