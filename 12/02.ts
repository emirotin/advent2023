import { readLines, sum } from "../lib/index.js";
import { countOptions, parseLine } from "./lib.js";

const repeat = (s: string, n: number, sep: string) =>
	Array.from({ length: n }).fill(s).join(sep);

// const lines = readLines(import.meta.url, "input.txt")
// 	.map((l) => l.trim())
// 	.filter(Boolean)
// 	.map((line) => {
// 		const [row, counts] = line.split(" ");
// 		return [repeat(row!, 5, "?"), repeat(counts!, 5, ",")].join(" ");
// 	})
// 	.map(parseLine);

const line = "????#??????. 1,2,3";
const [row, counts] = line.split(" ");
const newLine = [repeat(row!, 5, "?"), repeat(counts!, 5, ",")].join(" ");
const l = parseLine(newLine);
console.log(countOptions(l.chunks, l.counts));
// console.log(
// 	sum(
// 		lines.map(({ chunks, counts }, i) => {
// 			console.log(i);
// 			return countOptions(chunks, counts);
// 		})
// 	)
// );
