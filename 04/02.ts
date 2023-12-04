import { readLines, sum } from "../lib/index.js";
import { parseLine } from "./lib.js";

const cards = readLines(import.meta.url, "input.txt")
	.map((l) => l.trim())
	.filter(Boolean)
	.map(parseLine);

const total = cards.length;

const counts = Array.from({ length: total }).fill(1) as number[];

const countWin = ([winning, draw]: number[][]) => {
	let res = 0;
	for (const n of draw!) {
		if (!winning!.includes(n)) continue;

		res += 1;
	}

	return res;
};

for (let i = 0; i < total; i++) {
	const mult = counts[i]!;
	const wins = countWin(cards[i]!);

	for (let j = 1; j <= wins; j++) {
		counts[i + j] += mult;
	}
}

console.log(sum(counts));
