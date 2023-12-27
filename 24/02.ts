import { readLines, sum } from "../lib/index.js";
import { parseLine, type Vector, type Obj } from "./lib.js";

const pow = (v: Vector) => sum(v.map(Math.abs));

const objs = readLines(import.meta.url, "input.txt")
	.map((l) => l.trim())
	.filter(Boolean)
	.map(parseLine)
	.sort((a, b) => pow(b.velocities) - pow(a.velocities));

// const add = (v1: Vector, v2: Vector): Vector =>
// 	[v1[0] + v2[0], v1[1] + v2[1], v1[2] + v2[2]] as const;

// const addInPlace = (v1: Vector, v2: Vector) => {
// 	v1[0] += v2[0];
// 	v1[1] += v2[1];
// 	v1[2] += v2[2];
// };

// const sub = (v1: Vector, v2: Vector): Vector =>
// 	[v1[0] - v2[0], v1[1] - v2[1], v1[2] - v2[2]] as const;

// const mul = (v: Vector, n: number): Vector =>
// 	[v[0] * n, v[1] * n, v[2] * n] as const;

// const gcd = (a: number, b: number) => {
// 	while (a > 0 && b > 0) {
// 		if (a < b) {
// 			const c = b;
// 			b = a;
// 			a = c;
// 		}
// 		a = a % b;
// 	}

// 	return Math.max(a, b);
// };

// const isInt = (n: number) => n === ~~n;

// const allDivisors = (n: number) => {
// 	const res = [];
// 	for (let i = 1; i <= n; i++) {
// 		if (isInt(n / i)) res.push(i);
// 	}
// 	return res;
// };

// const intersectsWith =
// 	(
// 		{ coords: c1, velocities: v1 }: Obj,
// 		{ i, j, t1, t2 }: { i: number; j: number; t1: number; t2: number }
// 	) =>
// 	({ coords: c2, velocities: v2 }: Obj, k: number) => {
// 		if (k === i || k === j) return true;

// 		const x01 = c1[0];
// 		const y01 = c1[1];
// 		const vx1 = v1[0];
// 		const vy1 = v1[1];
// 		const x02 = c2[0];
// 		const y02 = c2[1];
// 		const vx2 = v2[0];
// 		const vy2 = v2[1];

// 		const a = vx2 * vy1 - vx1 * vy2;
// 		if (a === 0) return false;
// 		const b = (x01 - x02) * vy1 - (y01 - y02) * vx1;
// 		const tk = b / a;
// 		const tBase = (tk * vx2 + x02 - x01) / vx1;

// 		if (tk <= t2 || tk !== tBase || tk < 0 || !isInt(tk)) return false;

// 		const z1 = c1[2] + tBase * v1[2];
// 		const z2 = c2[2] + tk * v2[2];

// 		return z1 === z2;
// 	};

// const check = (i: number, t1: number, j: number, t2: number) => {
// 	const o1 = objs[i]!;
// 	const o2 = objs[j]!;
// 	// if (t2 <= 0) return;

// 	const velocities = [
// 		(o2.coords[0] +
// 			o2.velocities[0] * t2 -
// 			o1.coords[0] -
// 			o1.velocities[0] * t1) /
// 			(t2 - t1),
// 		(o2.coords[1] +
// 			o2.velocities[1] * t2 -
// 			o1.coords[1] -
// 			o1.velocities[1] * t1) /
// 			(t2 - t1),
// 		(o2.coords[2] +
// 			o2.velocities[2] * t2 -
// 			o1.coords[2] -
// 			o1.velocities[2] * t1) /
// 			(t2 - t1),
// 	] satisfies Vector;
// 	if (!velocities.every(isInt)) return;
// 	const coords = [
// 		o1.coords[0] + (o1.velocities[0] - velocities[0]) * t1,
// 		o1.coords[1] + (o1.velocities[1] - velocities[1]) * t1,
// 		o1.coords[2] + (o1.velocities[2] - velocities[2]) * t1,
// 	] satisfies Vector;

// 	if (objs.every(intersectsWith({ coords, velocities }, { i, j, t1, t2 }))) {
// 		return coords;
// 	}
// };

// const gcdVec = (v: Vector) =>
// 	gcd(Math.abs(v[0]), gcd(Math.abs(v[1]), Math.abs(v[2])));

// const find = () => {
// 	for (let i = 0; i < objs.length; i++) {
// 		for (let j = 0; j < objs.length; j++) {
// 			if (j === i) continue;

// 			console.log(i, j);
// 			const obj1 = objs[i]!;
// 			const obj2 = objs[j]!;

// 			const dc = sub(obj2.coords, obj1.coords);
// 			const dv = sub(obj2.velocities, obj1.velocities);

// 			let diffV = dc;

// 			for (let t1 = 1; t1 < 10_000; t1++) {
// 				addInPlace(diffV, dv);
// 				for (const d of allDivisors(gcdVec(diffV))) {
// 					let coords = check(i, t1, j, t1 + d);
// 					if (coords) return coords;
// 				}
// 			}
// 		}
// 	}
// 	return [];
// };

// console.log(sum(find()));

type Option = {
	min: number;
	max: number;
	minVel: number;
	maxVel: number;
};

const options = [[], [], []] as Option[][];

for (const c of [0, 1, 2]) {
	for (let sign of [-1, 1]) {
		// console.log("\n\n" + "-+".charAt((sign + 1) / 2) + "xyz".charAt(c));
		const oppositeDir = objs
			.filter((o) => o.velocities[c]! * sign < 0)
			.sort((a, b) => a.coords[c]! - b.coords[c]!);
		const sameDir = objs
			.filter((o) => o.velocities[c]! * sign > 0)
			.sort((a, b) => a.coords[c]! - b.coords[c]!);
		const oppositeDirBoundary =
			sign > 0
				? oppositeDir[0]!.coords[c]!
				: oppositeDir[oppositeDir.length - 1]!.coords[c]!;

		for (let i = -1; i < sameDir.length; i++) {
			let leftBoundary = i === -1 ? -Infinity : sameDir[i]!.coords[c]!;
			let rightBoundary =
				i === sameDir.length - 1 ? Infinity : sameDir[i + 1]!.coords[c]!;
			if (
				(sign > 0 && leftBoundary >= oppositeDirBoundary) ||
				(sign < 0 && rightBoundary <= oppositeDirBoundary)
			) {
				continue;
			}

			leftBoundary =
				Math.max(leftBoundary, sign > 0 ? -Infinity : oppositeDirBoundary) + 1;
			rightBoundary =
				Math.min(rightBoundary, sign < 0 ? Infinity : oppositeDirBoundary) - 1;

			if (leftBoundary > rightBoundary) continue;

			const runningAhead =
				sign > 0 ? sameDir.slice(i + 1) : sameDir.slice(0, i + 1);
			const runningBehind =
				sign > 0 ? sameDir.slice(0, i + 1) : sameDir.slice(i + 1);

			let minVel =
				runningAhead.length > 0
					? sign *
					  (Math.max(...runningAhead.map((o) => o.velocities[c]! * sign)) + 1)
					: -Infinity;
			let maxVel =
				runningBehind.length > 0
					? sign *
					  (Math.min(...runningBehind.map((o) => o.velocities[c]! * sign)) - 1)
					: Infinity;
			if (sign > 0) {
				minVel = Math.max(minVel, 0);
			} else {
				maxVel = Math.min(maxVel, 0);
			}

			if (minVel > maxVel) {
				continue;
			}

			// console.log("coord between", leftBoundary, rightBoundary);
			// console.log("velocity between", minVel, maxVel);
			// console.log(
			// 	"coord options, 10^",
			// 	~~Math.log10(rightBoundary - leftBoundary)
			// );
			options[c]!.push({
				min: leftBoundary,
				max: rightBoundary,
				minVel,
				maxVel,
			});
		}
	}
}

console.dir(options, { depth: Infinity });
