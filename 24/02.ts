import { readLines, sum } from "../lib/index.js";
import { parseLine, type Vector } from "./lib.js";

const objs = readLines(import.meta.url, "demo.txt")
	.map((l) => l.trim())
	.filter(Boolean)
	.map(parseLine);

const intersect = (c1: Vector, v1: Vector, c2: Vector, v2: Vector) => {
	const x01 = c1[0];
	const y01 = c1[1];
	const vx1 = v1[0];
	const vy1 = v1[1];
	const x02 = c2[0];
	const y02 = c2[1];
	const vx2 = v2[0];
	const vy2 = v2[1];

	const a = vx2 * vy1 - vx1 * vy2;
	if (a === 0) return false;
	const b = (x01 - x02) * vy1 - (y01 - y02) * vx1;
	const t2 = b / a;
	const t1 = (t2 * vx2 + x02 - x01) / vx1;

	const z1 = c1[2] + t1 * v1[2];
	const z2 = c2[2] + t2 * v2[2];

	return z1 === z2;
};

for (let i = 0; i < objs.length - 1; i++) {
	for (let j = i + 1; j < objs.length; j++) {
		if (
			intersect(
				objs[i]!.coords,
				objs[i]!.velocities,
				objs[j]!.coords,
				objs[j]!.velocities
			)
		) {
			console.log(objs[i], objs[j]);
		}
	}
}
