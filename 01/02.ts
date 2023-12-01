import { readLines, sum } from "../lib/index.js";

const lines = readLines(import.meta.url, "input.txt");

const digit = /one|two|three|four|five|six|seven|eight|nine|\d/;

const values = {
	one: 1,
	two: 2,
	three: 3,
	four: 4,
	five: 5,
	six: 6,
	seven: 7,
	eight: 8,
	nine: 9,
} as const;

const findDigits = (s: string) => {
	const res: string[] = [];

	while (s.length) {
		const m = s.match(digit);
		if (!m) break;
		res.push(m[0]);
		s = s.slice(m.index! + 1);
	}

	return res;
};

const res = sum(
	lines
		.map((l) => l.trim())
		.filter(Boolean)
		.map((l) => {
			const ds = findDigits(l).map((d) => {
				return d in values ? values[d as keyof typeof values] : parseInt(d, 10);
			});

			const first = ds[0]!;
			const last = ds[ds.length - 1]!;

			return first * 10 + last;
		})
);

console.log(res);
