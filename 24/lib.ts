import { parseNums } from "../lib/index.js";

export type Vector = readonly [number, number, number];

export type Obj = {
	coords: Vector;
	velocities: Vector;
};

export const parseLine = (line: string): Obj => {
	const parts = line.split(" @ ");
	const coords = parseNums(parts[0]!, ", ") as unknown as Vector;
	const velocities = parseNums(parts[1]!, ", ") as unknown as Vector;
	return { coords, velocities };
};
