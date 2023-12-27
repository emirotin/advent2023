import { parseNums } from "../lib/index.js";

export type Vector = [number, number, number];

export type Obj = {
	coords: Vector;
	velocities: Vector;
	index: number;
};

export const parseLine = (line: string, i: number): Obj => {
	const parts = line.split(" @ ");
	const coords = parseNums(parts[0]!, ", ") as unknown as Vector;
	const velocities = parseNums(parts[1]!, ", ") as unknown as Vector;
	return { coords, velocities, index: i };
};
