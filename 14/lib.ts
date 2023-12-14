import { sum } from "../lib/index.js";

export type Char = "." | "O" | "#";

export const parseLine = (line: string) => line.split("") as Char[];

export const totalLoad = (map: Char[][]) => {
	const rows = map.length;
	return sum(
		map.map((row, i) => (rows - i) * sum(row.map((c) => (c === "O" ? 1 : 0))))
	);
};
