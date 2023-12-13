import { readFile, sum } from "../lib/index.js";

const findReflection = (lines: string[]) => {
	const n = lines.length;

	for (let i = 1; i < n; i++) {
		const matchingLinesCount = Math.min(i, n - i);
		let ok = true;

		for (let j = 0; j < matchingLinesCount; j++) {
			if (lines[i - j - 1] !== lines[i + j]) {
				ok = false;
				break;
			}
		}

		if (ok) return i;
	}

	return 0;
};

const findHorizontalReflection = (map: string[]) => {
	return findReflection(map);
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
	return findReflection(toColumns(map));
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
