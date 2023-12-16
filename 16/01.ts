import { readLines, sum, uniq } from "../lib/index.js";

const parseLine = (l: string) =>
	l.split("") as Array<"." | "|" | "-" | "/" | "\\">;

const map = readLines(import.meta.url, "input.txt")
	.map((l) => l.trim())
	.filter(Boolean)
	.map(parseLine);

const rows = map.length;
const cols = map[0]!.length;

type Point = { r: number; c: number };

type Direction = "n" | "s" | "w" | "e";

type Beam = {
	current: Point;
	direction: Direction;
};

const beams: Beam[] = [
	{
		current: { r: 0, c: -1 },
		direction: "e",
	},
];
const newBeams: Beam[] = [];

const dr: Record<Direction, number> = {
	n: -1,
	s: 1,
	w: 0,
	e: 0,
} as const;

const dc: Record<Direction, number> = {
	n: 0,
	s: 0,
	w: -1,
	e: 1,
} as const;

const globalHistory = new Map<string, boolean>();
const visitedPoints = new Set<string>();

while (beams.length) {
	let i = 0;
	while (i < beams.length) {
		const b = beams[i]!;

		const key = `${b.current.r}-${b.current.c}-${b.direction}`;
		if (globalHistory.has(key)) {
			beams.splice(i, 1);
			continue;
		}
		globalHistory.set(key, true);

		if (
			b.current.r >= 0 &&
			b.current.r < rows &&
			b.current.c >= 0 &&
			b.current.c < cols
		) {
			visitedPoints.add(`${b.current.r}-${b.current.c}`);
		}

		const p: Point = {
			r: b.current.r + dr[b.direction],
			c: b.current.c + dc[b.direction],
		};
		b.current = p;

		if (p.r < 0 || p.r >= rows || p.c < 0 || p.c >= cols) {
			beams.splice(i, 1);
			continue;
		}

		const c = map[p.r]![p.c]!;
		if (
			c === "." ||
			(c === "-" && ["w", "e"].includes(b.direction)) ||
			(c === "|" && ["n", "s"].includes(b.direction))
		) {
			i += 1;
			continue;
		}

		if (c === "/") {
			switch (b.direction) {
				case "e":
					b.direction = "n";
					break;
				case "w":
					b.direction = "s";
					break;
				case "n":
					b.direction = "e";
					break;
				case "s":
					b.direction = "w";
					break;
			}
			i += 1;
			continue;
		}

		if (c === "\\") {
			switch (b.direction) {
				case "e":
					b.direction = "s";
					break;
				case "w":
					b.direction = "n";
					break;
				case "n":
					b.direction = "w";
					break;
				case "s":
					b.direction = "e";
					break;
			}
			i += 1;
			continue;
		}

		beams.splice(i, 1);

		if (c === "-") {
			newBeams.push(
				{ current: p, direction: "w" },
				{ current: p, direction: "e" }
			);
		} else {
			newBeams.push(
				{ current: p, direction: "n" },
				{ current: p, direction: "s" }
			);
		}
	}

	if (newBeams.length) {
		beams.push(...newBeams);
		newBeams.splice(0, newBeams.length);
	}
}

console.log(visitedPoints.size);
