import { readFile, sum } from "../lib/index.js";

const input = readFile(import.meta.url, "input.txt").trim();

const [workflowsInput, partsInput] = input.split("\n\n");

const parsePart = (s: string) => {
	const obj: Record<string, number> = {};
	const pairs = s.slice(1, -1).split(",");
	for (const p of pairs) {
		const [k, v] = p.split("=");
		obj[k!] = parseInt(v!);
	}
	return obj;
};

const parseCondition = (s: string) => {
	const match = s.match(/^(\w+)([<>])(\d+)$/);
	if (!match) {
		throw new Error(`Malformed: ${s}`);
	}
	const attr = match[1]!;
	const sign = match[2]!;
	const val = parseInt(match[3]!);

	const condition = (obj: Record<string, number>) => {
		if (sign === "<") return obj[attr]! < val;
		return obj[attr]! > val;
	};

	return condition;
};

const parseRule = (s: string) => {
	const parts = s.split(":");
	if (parts.length < 2) {
		return {
			condition: () => true,
			workflow: parts[0]!,
		};
	}

	return {
		condition: parseCondition(parts[0]!),
		workflow: parts[1]!,
	};
};

type Rule = {
	condition: (obj: Record<string, number>) => boolean;
	workflow: string;
};

const parseWorkflow = (s: string) => {
	const i = s.indexOf("{");
	const name = s.slice(0, i);
	const rules = s
		.slice(i + 1, -1)
		.split(",")
		.map(parseRule);

	return { name, rules };
};

const parts = partsInput!.split("\n").map(parsePart);
const workflows = workflowsInput!
	.split("\n")
	.map(parseWorkflow)
	.reduce<Record<string, Rule[]>>((acc, w) => {
		acc[w.name] = w.rules;
		return acc;
	}, {});

const accepted: Array<Record<string, number>> = [];
const run = () => {
	for (const p of parts) {
		let w = "in";

		while (true) {
			if (w === "A") {
				accepted.push(p);
				break;
			}
			if (w === "R") {
				break;
			}

			for (const r of workflows[w]!) {
				if (r.condition(p)) {
					w = r.workflow;
					break;
				}
			}
		}
	}
};

run();
console.log(sum(accepted.map((obj) => sum(Object.values(obj)))));
