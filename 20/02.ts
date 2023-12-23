import { readLines, uniq } from "../lib/index.js";
import { prepareModules } from "./lib.js";

const { pushTheButtonTM, modules, FlipFlopModule } = prepareModules(
	readLines(import.meta.url, "input.txt")
		.map((l) => l.trim())
		.filter(Boolean)
);

const flipNames = [...modules.values()]
	.filter((m) => m.type === "flip")
	.map((m) => m.name);

const knownPeriods: number[] = [];

const flips = flipNames.reduce<Record<string, string>>((acc, f) => {
	acc[f] = "0";
	return acc;
}, {});

const findPeriod = (s: string) => {
	const l = s.length;
	for (let i = 2; i < l / 2; i++) {
		if (l % i) continue;

		let found = true;
		for (let j = 1; j < l / i; j++) {
			if (s.slice(0, i) !== s.slice(j * i, (j + 1) * i)) {
				found = false;
				break;
			}
		}
		if (found) {
			return i;
		}
	}
	return null;
};

let i = 0;
while (Object.keys(flips).length || i < 10_000) {
	pushTheButtonTM();
	i += 1;

	for (const f of Object.keys(flips)) {
		const s =
			flips[f]! +
			Number((modules.get(f) as InstanceType<typeof FlipFlopModule>).state);
		let p;
		if (
			i >= 10_000 &&
			s.includes("0") &&
			s.includes("1") &&
			(p = findPeriod(s))
		) {
			delete flips[f];
			knownPeriods.push(p);
		} else {
			flips[f] = s;
		}
	}
}

const gcd = (a: number, b: number) => {
	while (a > 0 && b > 0) {
		if (a < b) {
			const c = b;
			b = a;
			a = c;
		}
		a = a % b;
	}

	return Math.max(a, b);
};

const lcm = (a: number, b: number) => (a * b) / gcd(a, b);

console.log(uniq(knownPeriods).reduce(lcm));
