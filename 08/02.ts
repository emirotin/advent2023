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

const initialStates = Object.keys(transitions).filter((s) => s.endsWith("A"));

const calc = (initialState: string) => {
	let state = initialState;
	let stepNumber = 0;
	const stack: string[] = [];
	const zIndices: number[] = [];

	do {
		if (state.endsWith("Z")) {
			zIndices.push(stepNumber);
		}

		const normalizedStepNumber = stepNumber % steps.length;
		const nextStep = steps[normalizedStepNumber]!;
		const currentFullState = state + "-" + normalizedStepNumber;

		const seenIndex = stack.indexOf(currentFullState);

		if (seenIndex >= 0) {
			return {
				setup: seenIndex,
				period: stepNumber - seenIndex,
				zIndices,
			};
		}

		stack.push(currentFullState);
		state = transitions[state]![nextStep]!;
		stepNumber += 1;
	} while (true);
};

const gcd = (a: number, b: number) => {
	while (a > 0 && b > 0) {
		if (a < b) {
			const c = b;
			b = a;
			a = c;
		}
		a -= b;
	}

	return Math.max(a, b);
};

const lcm = (a: number, b: number) => (a * b) / gcd(a, b);

// total steps until Z = setup + period * k + zIndex - setup = period * k + zIndex
// it happens that in all cases there's a single Z on the period, and zIndex === period
// because of that for each initial state total steps to Z is always period * k
// and the minimal common number of steps is LCM

const periods = initialStates.map(calc).map(({ period }) => period);

console.log(periods.reduce(lcm));
