import { readLines } from "../lib/index.js";
import { parseLine, solve, type LinVector } from "./lib.js";

const objs = readLines(import.meta.url, "input.txt")
	.map((l) => l.trim())
	.filter(Boolean)
	.map(parseLine);

const eqs = objs.slice(0, 5).map(({ coords, velocities }) => {
	const A = velocities[1];
	const B = velocities[0].negated();
	const C = coords[1].negated();
	const D = coords[0];
	const E = coords[1].mul(velocities[0]).sub(coords[0].mul(velocities[1]));
	return { A, B, C, D, E };
});

const base = eqs[0]!;

const eqsReduced = eqs
	.slice(1)
	.map(({ A, B, C, D, E }) => [
		A.sub(base.A),
		B.sub(base.B),
		C.sub(base.C),
		D.sub(base.D),
		E.sub(base.E),
	]);

const A = eqsReduced.map((r) => r.slice(0, 4));
const b = eqsReduced.map((r) => r[4]!.negated());

const ans = solve(A, b) as LinVector;

const x0 = ans[0]!;
const y0 = ans[1]!;
const vx = ans[2]!;
const vy = ans[3]!;

const t1 = objs[0]!.coords[0].sub(x0).div(vx.sub(objs[0]!.velocities[0]));
const t2 = objs[1]!.coords[0].sub(x0).div(vx.sub(objs[1]!.velocities[0]));

const vz = objs[0]!.coords[2]
	.add(objs[0]!.velocities[2].mul(t1))
	.sub(objs[1]!.coords[2])
	.sub(objs[1]!.velocities[2].mul(t2))
	.div(t1.sub(t2));

const z0 = objs[0]!.coords[2]
	.add(objs[0]!.velocities[2].mul(t1))
	.sub(vz.mul(t1));

console.log(x0.add(y0).add(z0).toFixed(0));
