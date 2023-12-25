import { readLines, parseNums } from "../lib/index.js";

const parseLine = (line: string) => {
	const parts = line.split(" @ ");
	const coords = parseNums(parts[0]!, ", ") as unknown as readonly [
		number,
		number,
		number
	];
	const velocities = parseNums(parts[1]!, ", ") as unknown as readonly [
		number,
		number,
		number
	];
	return { coords, velocities };
};

const objs = readLines(import.meta.url, "input.txt")
	.map((l) => l.trim())
	.filter(Boolean)
	.map(parseLine);

const MIN = 200000000000000;
const MAX = 400000000000000;

const willIntersect = (
	x01: number,
	y01: number,
	vx1: number,
	vy1: number,
	x02: number,
	y02: number,
	vx2: number,
	vy2: number
) => {
	const a = vx2 * vy1 - vx1 * vy2;
	if (a === 0) return false;
	const b = (x01 - x02) * vy1 - (y01 - y02) * vx1;
	const t2 = b / a;
	if (t2 < 0) return false;
	const t1 = (t2 * vx2 + x02 - x01) / vx1;
	if (t1 < 0) return false;

	const x1 = x01 + vx1 * t1;
	const y1 = y01 + vy1 * t1;
	const x2 = x02 + vx2 * t2;
	const y2 = y02 + vy2 * t2;

	return x1 >= MIN && x1 <= MAX && y1 >= MIN && y2 <= MAX;
};

let res = 0;
for (let i = 0; i < objs.length - 1; i++) {
	for (let j = i + 1; j < objs.length; j++) {
		res += Number(
			willIntersect(
				objs[i]!.coords[0],
				objs[i]!.coords[1],
				objs[i]!.velocities[0],
				objs[i]!.velocities[1],
				objs[j]!.coords[0],
				objs[j]!.coords[1],
				objs[j]!.velocities[0],
				objs[j]!.velocities[1]
			)
		);
	}
}

console.log(res);
