import { readFile, sum } from "../lib/index.js";

const input = readFile(import.meta.url, "input.txt").trim();

const [workflowsInput] = input.split("\n\n");

const parseCondition = (s: string) => {
	const match = s.match(/^(\w+)([<>])(\d+)$/);
	if (!match) {
		throw new Error(`Malformed: ${s}`);
	}
	const attr = match[1]! as "x" | "m" | "a" | "s";
	const sign = match[2]! as "<" | ">";
	const val = parseInt(match[3]!);

	return { attr, sign, val };
};

const parseRule = (s: string) => {
	const parts = s.split(":");
	if (parts.length < 2) {
		return {
			attr: "x" as const,
			sign: "<" as const,
			val: 4001,
			workflow: parts[0]!,
		};
	}

	return {
		...parseCondition(parts[0]!),
		workflow: parts[1]!,
	};
};

type Rule = {
	attr: "x" | "m" | "a" | "s";
	sign: "<" | ">";
	val: number;
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

const workflows = workflowsInput!
	.split("\n")
	.map(parseWorkflow)
	.reduce<Record<string, Rule[]>>((acc, w) => {
		acc[w.name] = w.rules;
		return acc;
	}, {});

type Interval = readonly [number, number];
type Part = {
	x: Interval;
	m: Interval;
	a: Interval;
	s: Interval;
	w: string;
};

const parts: Part[] = [
	{
		x: [1, 4000],
		m: [1, 4000],
		a: [1, 4000],
		s: [1, 4000],
		w: "in",
	},
];

const accepted: Array<Part> = [];
const run = () => {
	while (parts.length) {
		let i = 0;
		while (i < parts.length) {
			let p = parts[i]!;

			if (p.w === "A") {
				accepted.push(p);
				parts.splice(i, 1);
				continue;
			}

			if (p.w === "R") {
				parts.splice(i, 1);
				continue;
			}

			for (const r of workflows[p.w]!) {
				// full compatibility
				if (
					(r.sign === "<" && p[r.attr][1] < r.val) ||
					(r.sign === ">" && p[r.attr][0] > r.val)
				) {
					p.w = r.workflow;
					i += 1;
					break;
				}

				// completely out of interval
				if (
					(r.sign === "<" && p[r.attr][0] >= r.val) ||
					(r.sign === ">" && p[r.attr][1] <= r.val)
				) {
					continue;
				}

				// partial comp, split
				let newPart: Part | null = null;
				if (r.sign === "<") {
					const low = [p[r.attr][0], r.val - 1] as const;
					const high = [r.val, p[r.attr][1]] as const;
					newPart =
						r.val <= 4000
							? {
									...p,
									[r.attr]: high,
							  }
							: null;
					p[r.attr] = low;
					p.w = r.workflow;
				} else {
					const low = [p[r.attr][0], r.val] as const;
					const high = [r.val + 1, p[r.attr][1]] as const;
					newPart = {
						...p,
						[r.attr]: low,
					};
					p[r.attr] = high;
					p.w = r.workflow;
				}

				parts.push(p);
				if (newPart) {
					p = parts[i] = newPart;
				} else {
					parts.splice(i, 1);
					break;
				}
			}
		}
	}
};

run();
console.log(
	sum(
		accepted.map(
			(o) =>
				(1 + o.x[1] - o.x[0]) *
				(1 + o.m[1] - o.m[0]) *
				(1 + o.a[1] - o.a[0]) *
				(1 + o.s[1] - o.s[0])
		)
	)
);
