import { readLines, sum } from "../lib/index.js";
import { countOptions, parseLine } from "./lib.js";

const repeat = (s: string, n: number, sep: string) =>
	Array.from({ length: n }).fill(s).join(sep);

const lines = readLines(import.meta.url, "input.txt")
	.map((l) => l.trim())
	.filter(Boolean)
	.map((line) => {
		const [row, counts] = line.split(" ");
		return [repeat(row!, 5, "?"), repeat(counts!, 5, ",")].join(" ");
	})
	.map(parseLine);

console.log(
	sum(lines.map(({ chunks, counts }) => countOptions(chunks, counts)))
);
