import { readLines, sum } from "../lib/index.js";
import { parseLine, type Vector, type Obj } from "./lib.js";

const pow = (v: Vector) => sum(v.map(Math.abs));

const objs = readLines(import.meta.url, "input.txt")
	.map((l) => l.trim())
	.filter(Boolean)
	.map(parseLine)
	.sort((a, b) => pow(b.velocities) - pow(a.velocities));

const obj1 = objs[0]!;
const obj2 = objs[1]!;
const rest = objs.slice(2);

const add = (v1: Vector, v2: Vector): Vector =>
	[v1[0] + v2[0], v1[1] + v2[1], v1[2] + v2[2]] as const;

const sub = (v1: Vector, v2: Vector): Vector =>
	[v1[0] - v2[0], v1[1] - v2[1], v1[2] - v2[2]] as const;

const mul = (v: Vector, n: number): Vector =>
	[v[0] * n, v[1] * n, v[2] * n] as const;

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

const isInt = (n: number) => n === ~~n;

const allDivisors = (n: number) => {
	const res = [];
	for (let i = 1; i <= n; i++) {
		if (isInt(n / i)) res.push(i);
	}
	return res;
};

const intersectsWith =
	({ coords: c1, velocities: v1 }: Obj) =>
	({ coords: c2, velocities: v2 }: Obj) => {
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

		if (t2 !== t1 || t2 < 0 || !isInt(t2)) return false;

		const z1 = c1[2] + t1 * v1[2];
		const z2 = c2[2] + t2 * v2[2];

		return z1 === z2;
	};

const check = (o1: Obj, t1: number, o2: Obj, t2: number) => {
	console.log(t1, t2);
	if (t2 < 0) return;

	const velocities = [
		(o2.coords[0] +
			o2.velocities[0] * t2 -
			o1.coords[0] -
			o1.velocities[0] * t1) /
			(t2 - t1),
		(o2.coords[1] +
			o2.velocities[1] * t2 -
			o1.coords[1] -
			o1.velocities[1] * t1) /
			(t2 - t1),
		(o2.coords[2] +
			o2.velocities[2] * t2 -
			o1.coords[2] -
			o1.velocities[2] * t1) /
			(t2 - t1),
	] as const;
	if (!velocities.every(isInt)) return;
	const coords = [
		o1.coords[0] + (o1.velocities[0] - velocities[0]) * t1,
		o1.coords[1] + (o1.velocities[1] - velocities[1]) * t1,
		o1.coords[2] + (o1.velocities[2] - velocities[2]) * t1,
	] as const;
	if (!coords.every(isInt)) return;

	if (rest.every(intersectsWith({ coords, velocities }))) {
		return coords;
	}
};

const gcdVec = (v: Vector) =>
	gcd(Math.abs(v[0]), gcd(Math.abs(v[1]), Math.abs(v[2])));

const dc = sub(obj2.coords, obj1.coords);
const dv = sub(obj2.velocities, obj1.velocities);

const find = () => {
	for (let t1 = 1; ; t1++) {
		const diffV = add(dc, mul(dv, t1));
		for (const d of allDivisors(gcdVec(diffV))) {
			let coords = check(obj1, t1, obj2, t1 + d);
			if (coords) return coords;
			coords = check(obj1, t1, obj2, t1 - d);
			if (coords) return coords;
		}
	}
};

console.log(sum(find()));
