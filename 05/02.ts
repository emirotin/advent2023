import { readLines } from "../lib/index.js";
import { parseMaps, parseSeeds, validateMaps, type Map } from "./lib.js";

const lines = readLines(import.meta.url, "input.txt").map((l) => l.trim());

type Range = { start: number; end: number };

function* getSeedRanges(ns: number[]) {
	while (ns.length) {
		let start = ns.shift()!;
		let length = ns.shift()!;
		yield { start, end: start + length - 1 };
	}
}

const seedsRanges = [...getSeedRanges(parseSeeds(lines.shift()!))];
const maps = [...parseMaps(lines.slice(1))];
validateMaps(maps);

function* lookupMap(map: Map, r: Range) {
	for (const mr of map.ranges) {
		if (r.end < mr.srcStart || r.start > mr.srcEnd) continue;

		if (r.start < mr.srcStart) {
			yield { start: r.start, end: mr.srcStart - 1 };
			r = { start: mr.srcStart, end: r.end };
		}

		const d = mr.destStart - mr.srcStart;
		if (r.end <= mr.srcEnd) {
			yield {
				start: r.start + d,
				end: r.end + d,
			};
			return;
		} else {
			yield { start: r.start + d, end: mr.srcEnd + d };
			r = { start: mr.srcEnd + 1, end: r.end };
		}
	}

	if (r.start <= r.end) {
		yield r;
	}
}

const mergeRanges = (ranges: Range[]) => {
	ranges = ranges.slice().sort((r1, r2) => r1.start - r2.start);

	let currentRange = ranges.shift()!;
	const res: Range[] = [];

	for (const nextRange of ranges) {
		if (nextRange.start <= currentRange.end + 1) {
			currentRange = { start: currentRange.start, end: nextRange.end };
		} else {
			res.push(currentRange);
			currentRange = nextRange;
		}
	}

	res.push(currentRange);

	return res;
};

export const mapSeedRangeToLocation = (maps: Map[]) => (seedRange: Range) => {
	let res = [seedRange];
	for (const map of maps) {
		res = mergeRanges(res.flatMap((r) => [...lookupMap(map, r)]));
	}
	return res;
};

console.log(
	Math.min(
		...seedsRanges.flatMap(mapSeedRangeToLocation(maps)).map((r) => r.start)
	)
);
