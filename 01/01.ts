import { readLines, sum } from "../lib/index.js";

const lines = readLines(import.meta.url, "input.txt");

const res = sum(
	lines
		.map((l) => l.trim())
		.filter(Boolean)
		.map((l) => l.split("").filter((c) => c.match(/\d/)))
		.map((ds) => {
			const first = ds.shift()!;
			const last = ds.pop() ?? first;
			return parseInt(first) * 10 + parseInt(last);
		})
);

console.log(res);

// console.log(
// 	lines
// 		.map((l) => l.trim())
// 		.filter(Boolean)
// 		.map((l) => l.split("").filter((c) => c.match(/\d/)))
// );
