import fs from "fs";
import { getGraph } from "./lib.js";
import { getFilePath } from "../lib/index.js";

const { vertexes, adjacency } = getGraph(import.meta.url, "input.txt");

fs.writeFileSync(
	getFilePath(import.meta.url, "matrix.csv"),
	adjacency.map((row) => row.join(", ")).join("\n")
);
fs.writeFileSync(getFilePath(import.meta.url, "vert.csv"), vertexes.join(", "));
