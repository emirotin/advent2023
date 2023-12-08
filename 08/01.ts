import { readLines } from "../lib/index.js";

const lines = readLines(import.meta.url, "input.txt")
	.map((l) => l.trim())
	.filter(Boolean);

const parseSteps = (line: string) =>
	line.split("").map((c) => (c === "R" ? 1 : 0));

const parseTransitions = (lines: string[]) =>
	lines.map((line) => {
		const [from, tos] = line.split(" = ");
		return {
			from: from!,
			tos: tos!.replaceAll(/[()]/g, "").split(", ") as [string, string],
		};
	});

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
