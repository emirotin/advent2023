import { readLines } from "../lib/index.js";
import { parseMaps, parseSeeds, validateMaps, type Map } from "./lib.js";

const lookupMap = (map: Map, n: number) => {
	for (const range of map.ranges) {
		if (n >= range.srcStart && n <= range.srcEnd) {
			return range.destStart + n - range.srcStart;
		}
	}
	return n;
};

const mapSeedToLocation = (maps: Map[]) => (seed: number) => {
	let res = seed;
	for (const map of maps) {
		res = lookupMap(map, res);
	}
	return res;
};

const lines = readLines(import.meta.url, "input.txt").map((l) => l.trim());

const seeds = parseSeeds(lines.shift()!);
const maps = [...parseMaps(lines.slice(1))];
validateMaps(maps);

console.log(Math.min(...seeds.map(mapSeedToLocation(maps))));
