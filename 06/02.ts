import { readLines } from "../lib/index.js";
import { getGoodInterval } from "./lib.js";

const lines = readLines(import.meta.url, "input.txt")
	.map((l) => l.trim())
	.filter(Boolean);

const parseLine = (line: string, prefix: string) => {
	if (!line.startsWith(prefix)) throw new Error(`Malformed: ${line}`);
	line = line.slice(prefix.length).trim().replaceAll(/\s/g, "");
	return parseInt(line);
};

const t = parseLine(lines.shift()!, "Time:");
const d = parseLine(lines.shift()!, "Distance:");

console.log(getGoodInterval(t, d));
