import { parseNums } from "../lib/index.js";

export const parseSeeds = (line: string) => {
	const [prefix, seeds] = line.split(": ");
	if (prefix !== "seeds" || !seeds) throw new Error(`Malformed: ${line}`);
	return parseNums(seeds!);
};

type MapRange = { srcStart: number; srcEnd: number; destStart: number };
export type Map = { from: string; to: string; ranges: MapRange[] };

export function* parseMaps(lines: string[]) {
	let map = "";
	let ranges: MapRange[] = [];
	let state: "in" | "out" = "out";

	lines = [...lines, ""];

	for (const line of lines) {
		if (state === "in") {
			if (!line) {
				const [from, to] = map.split("-to-");
				yield {
					from: from!,
					to: to!,
					ranges: ranges.sort((r1, r2) => r1.srcStart - r2.srcStart),
				} satisfies Map;
				state = "out";
			} else {
				const [destStart, srcStart, rangeLength] = parseNums(line);
				ranges.push({
					srcStart: srcStart!,
					srcEnd: srcStart! + rangeLength! - 1,
					destStart: destStart!,
				});
			}
		} else {
			map = line.trim().slice(0, -5);
			ranges = [];
			state = "in";
		}
	}
}

export const validateMaps = (maps: Map[]) => {
	if (!maps.length || maps.length < 2) throw new Error("Too few maps");
	if (maps[0]?.from !== "seed")
		throw new Error("First map should be from seeds");
	if (maps[maps.length - 1]?.to !== "location")
		throw new Error("Last map should be to location");
	for (let i = 1; i < maps.length; i++) {
		if (maps[i]?.from !== maps[i - 1]?.to)
			throw new Error(`Map ${i} from doesn't match previous maps to`);
	}
};
