import { readFile, sum } from "../lib/index.js";
import { parseMap, toColumns } from "./lib.js";

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

const findVerticalReflection = (map: string[]) => {
	return findReflection(toColumns(map));
};

const maps = readFile(import.meta.url, "input.txt")
	.split("\n\n")
	.map(parseMap);

const horizontalReflections = maps.map(findHorizontalReflection);
const verticalReflections = maps
	.filter((_, i) => horizontalReflections[i] === 0)
	.map(findVerticalReflection);

console.log(sum(horizontalReflections) * 100 + sum(verticalReflections));