import { parseNums } from "../lib/index.js";

export type Vector = readonly [number, number, number];

export const parseLine = (line: string) => {
	const parts = line.split(" @ ");
	const coords = parseNums(parts[0]!, ", ") as unknown as Vector;
	const velocities = parseNums(parts[1]!, ", ") as unknown as Vector;
	return { coords, velocities };
};
