import { readLines } from "../lib/index.js";

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

const strictCeil = (n: number) => (n === ~~n ? n + 1 : Math.ceil(n));
const strictFloor = (n: number) => (n === ~~n ? n - 1 : Math.floor(n));

const D_sqrt = Math.sqrt(t * t - 4 * d);
let c1 = Math.max(0, strictCeil((t - D_sqrt) / 2));
let c2 = Math.min(t, strictFloor((t + D_sqrt) / 2));

console.log(c2 - c1 + 1);
