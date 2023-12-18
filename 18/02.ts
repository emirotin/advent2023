import { readLines, parseNums, sum } from "../lib/index.js";

type Direction = "n" | "s" | "w" | "e";
type InputDir = "U" | "D" | "L" | "R";

type Step = {
	d: Direction;
	n: number;
	x: number;
	y: number;
};

const charToDirection: Record<InputDir, Direction> = {
	U: "n",
	D: "s",
	L: "w",
	R: "e",
};

// const encodedDirections = ["R", "D", "L", "U"] as const;

// const parseInstr = (s: string): Step => {
// 	const parts = s.split(" ")[2]!.slice(2, -1);
// 	const i = parseInt(parts.slice(-1));
// 	return {
// 		d: charToDirection[encodedDirections[i]!],
// 		n: parseInt("0x" + parts.slice(0, -1)),
// 	};
// };

const parseInstr = (s: string): Step => {
	const parts = s.split(" ");
	return {
		d: charToDirection[parts[0] as InputDir],
		n: parseInt(parts[1]!),
		x: 0,
		y: 0,
	};
};

let steps = readLines(import.meta.url, "demo.txt")
	.map((l) => l.trim())
	.filter(Boolean)
	.map(parseInstr);

const isRightTurn = (s1: Step, s2: Step) => {
	const d1 = s1.d;
	const d2 = s2.d;

	return (
		(d1 === "e" && d2 === "s") ||
		(d1 === "s" && d2 === "w") ||
		(d1 === "w" && d2 === "n") ||
		(d1 === "n" && d2 === "e")
	);
};

for (let i = 0; i < steps.length; i++) {
	const s1 = steps[i]!;
	const s2 = steps[(i + 1) % steps.length]!;
	if (isRightTurn(s1, s2)) {
		s2.n += 1;
	} else {
		s1.n -= 1;
	}
}

let x = 0;
let y = 0;

for (let i = 0; i < steps.length; i++) {
	const s = steps[i]!;
	s.x = x;
	s.y = y;
	switch (s.d) {
		case "e":
			x += s.n;
			break;
		case "w":
			x -= s.n;
			break;
		case "n":
			y -= s.n;
			break;
		case "s":
			y += s.n;
			break;
	}
}

const areOpposite = (s1: Step, s2: Step) => {
	const d1 = s1.d;
	const n1 = s1.n;
	const d2 = s2.d;
	const n2 = s2.n;
	const diff = Math.abs(n1 - n2);

	if (
		(d1 === "n" && d2 === "s") ||
		(d1 === "s" && d2 === "n") ||
		(d1 === "w" && d2 === "e") ||
		(d1 === "e" && d2 === "w")
	) {
		return {
			n: diff,
			d: n1 > n2 ? d1 : d2,
		};
	}
};

let result = 0;

while (steps.length) {
	let changed = false;
	// cut extending rects
	for (let i = 0; i < steps.length; i++) {
		const s1 = steps[i]!;
		const s2 = steps[(i + 1) % steps.length]!;
		const s3 = steps[(i + 2) % steps.length]!;
		if (isRightTurn(s1, s2) && isRightTurn(s2, s3)) {
			const closestEdge =
				s2.d === "s"
					? Math.max(
							...steps
								.filter((s) => (s.d === "n" || s.d === "s") && s.x < s2.x)
								.map((s) => s.x)
					  )
					: s2.d === "n"
					? Math.min(
							...steps
								.filter((s) => (s.d === "n" || s.d === "s") && s.x > s2.x)
								.map((s) => s.x)
					  )
					: s2.d === "e"
					? Math.min(
							...steps
								.filter((s) => (s.d === "e" || s.d === "w") && s.y > s2.y)
								.map((s) => s.y)
					  )
					: s2.d === "w"
					? Math.max(
							...steps
								.filter((s) => (s.d === "e" || s.d === "w") && s.y < s2.y)
								.map((s) => s.y)
					  )
					: 0;
			const m = Math.min(
				s1.n,
				s3.n,
				Math.abs(closestEdge - (s2.d === "n" || s2.d === "s" ? s2.x : s2.y))
			);
			if (m > 0) {
				s1.n -= m;
				s3.n -= m;
				result += m * s2.n;
				changed = true;
			}
		}
	}

	if (!changed) break;

	// remove empty segments
	steps = steps.filter(({ n }) => n > 0);
	// merge subsequent segments
	let i = 0;
	let diff;
	while (i < steps.length - 1) {
		const s1 = steps[i]!;
		const s2 = steps[(i + 1) % steps.length]!;
		if (s1.d === s2.d) {
			s2.n += s1.n;
			steps.splice(i, 1);
		} else if ((diff = areOpposite(s1, s2))) {
			Object.assign(s2, diff);
			steps.splice(i, 1);
		} else {
			i += 1;
		}
	}
}

console.log(result);
