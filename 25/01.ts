import fs from "fs";
import { getGraph } from "./lib.js";
import { isNotUndefined } from "../lib/index.js";

const { vertexes, adjacency } = getGraph(import.meta.url, "input.txt");

const n = vertexes.length;

const neighbors = (v: string) => {
	const i = vertexes.indexOf(v);
	if (i < 0) return [];
	return adjacency[i]!.map((_, j) =>
		adjacency[i]![j] ? vertexes[j] : undefined
	).filter(isNotUndefined);
};

// obtained via visually exploring the result of pot.py :-P
const EDGES_TO_REMOVE = ["vps-pzc", "dph-cvx", "xvk-sgc"];
