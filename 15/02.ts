import { readFile, sum } from "../lib/index.js";
import { hash } from "./lib.js";

const parseInstruction = (s: string) => {
	if (s.endsWith("-")) {
		return {
			op: "-" as const,
			label: s.slice(0, s.length - 1),
		};
	}

	const [label, fl] = s.split("=");
	return {
		op: "=" as const,
		label: label!,
		fl: parseInt(fl!),
	};
};

const instructions = readFile(import.meta.url, "input.txt")
	.trim()
	.split(",")
	.map(parseInstruction);

const boxes = Array.from(
	{ length: 256 },
	() => [] as Array<{ label: string; fl: number }>
);

for (const instr of instructions) {
	const i = hash(instr.label);
	const box = boxes[i]!;

	const j = box.findIndex(({ label }) => label === instr.label);
	if (instr.op === "-") {
		if (j >= 0) {
			box.splice(j, 1);
		}
	} else {
		if (j >= 0) {
			box[j]!.fl = instr.fl;
		} else {
			box.push({ label: instr.label, fl: instr.fl });
		}
	}
}

console.log(
	sum(
		boxes.map((lenses, i) =>
			sum(lenses.map((lens, j) => (i + 1) * (j + 1) * lens.fl))
		)
	)
);
