import { readLines, parseNums, prod } from "../lib/index.js";
import { getGoodInterval } from "./lib.js";

const lines = readLines(import.meta.url, "input.txt")
	.map((l) => l.trim())
	.filter(Boolean);

const parseLine = (line: string, prefix: string) => {
	if (!line.startsWith(prefix)) throw new Error(`Malformed: ${line}`);
	line = line.slice(prefix.length).trim();
	return parseNums(line);
};

const ts = parseLine(lines.shift()!, "Time:");
const ds = parseLine(lines.shift()!, "Distance:");

const opts = ts.map((t, i) => {
	const d = ds[i]!;
	return getGoodInterval(t, d);
});

console.log(prod(opts));
