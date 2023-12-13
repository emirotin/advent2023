import { readFile, sum } from "../lib/index.js";

const findHorizontalReflection = (map: string[]) => {
	const rows = map.length;
	for (let i = 1; i < rows; i++) {
		const count = Math.min(i, rows - i);
		let ok = true;
		for (let j = 0; j < count; j++) {
			if (map[i - j - 1] !== map[i + j]) {
				ok = false;
				break;
			}
		}
		if (ok) return i;
	}
	return 0;
};

const toColumns = (map: string[]) => {
	const rows = map.length;
	const columns = map[0]!.length;

	const rowsRange = Array.from({ length: rows }, (_, i) => i);

	return Array.from({ length: columns }, (_, c) =>
		rowsRange.map((r) => map[r]!.at(c)).join("")
	);
};

const findVerticalReflection = (map: string[]) => {
	map = toColumns(map);

	const columns = map.length;

	for (let i = 1; i < columns; i++) {
		const count = Math.min(i, columns - i);
		let ok = true;
		for (let j = 0; j < count; j++) {
			if (map[i - j - 1] !== map[i + j]) {
				ok = false;
				break;
			}
		}
		if (ok) return i;
	}
	return 0;
};

const parseMap = (map: string) => map.trim().split("\n");

const maps = readFile(import.meta.url, "input.txt")
	.split("\n\n")
	.map(parseMap);

const horizontalReflections = maps.map(findHorizontalReflection);
const verticalReflections = maps
	.filter((_, i) => horizontalReflections[i] === 0)
	.map(findVerticalReflection);

console.log(sum(horizontalReflections) * 100 + sum(verticalReflections));
