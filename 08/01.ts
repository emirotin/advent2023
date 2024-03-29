import { readLines } from "../lib/index.js";
import { parseSteps, parseTransitions } from "./lib.js";

const lines = readLines(import.meta.url, "input.txt")
	.map((l) => l.trim())
	.filter(Boolean);

const steps = parseSteps(lines[0]!);

const transitions = parseTransitions(lines.slice(1)).reduce<
	Record<string, [string, string]>
>((acc, { from, tos }) => {
	acc[from] = tos;
	return acc;
}, {});

let state = "AAA";
let stepsCount = 0;

while (state !== "ZZZ") {
	const step = steps[stepsCount % steps.length]!;
	state = transitions[state]![step]!;
	stepsCount += 1;
}

console.log(stepsCount);
