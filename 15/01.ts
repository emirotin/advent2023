import { readFile, sum } from "../lib/index.js";

const strings = readFile(import.meta.url, "input.txt")
	.trim()
	.split(",");

const hash = (s: string) => {
	let v = 0;
	for (const n of s.split("").map((c) => c.charCodeAt(0))) {
		v = ((v + n) * 17) % 256;
	}
	return v;
};

console.log(sum(strings.map(hash)));
