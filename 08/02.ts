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

let states = Object.keys(transitions).filter((s) => s.endsWith("A"));
let stepsCount = 0;

while (!states.every((s) => s.endsWith("Z"))) {
	console.log(states);
	const step = steps[stepsCount % steps.length]!;
	states = states.map((state) => transitions[state]![step]!);
	stepsCount += 1;
}

console.log(stepsCount);
