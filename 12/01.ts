import { parseNums, readLines, sum } from "../lib/index.js";

type Chunk = (true | undefined)[];

const parseLine = (line: string) => {
	const [row, counts] = line.split(" ");
	return {
		chunks: row!
			.split(/\.+/)
			.filter((chunk) => chunk.length > 0)
			.map((chunk) =>
				chunk.split("").map((c) => {
					if (c === "#") return true;
					return undefined;
				})
			),
		counts: parseNums(counts!, ","),
	};
};

const isEmpty = (chunk: Chunk) => chunk.every((x) => x === undefined);

const countOptions = (chunks: Chunk[], counts: number[]): number => {
	// place nothing among 0 or more chunks
	// - one way if all remaining chunks are empty
	// - no way if some of them must contain a mark
	if (counts.length === 0) return chunks.every(isEmpty) ? 1 : 0;
	// still have counts but no chunks = 0 ways
	if (chunks.length === 0) return 0;

	const firstChunk = chunks[0]!;
	const firstCount = counts[0]!;

	// if the first chunk is empty one option is there are no marks inside
	let res = isEmpty(firstChunk) ? countOptions(chunks.slice(1), counts) : 0;

	// then consider every option how the first count can be placed inside of the first chunk
	for (let offset = 0; offset <= firstChunk.length - firstCount; offset++) {
		// our assumption is we consider first <offset> fields as unmarked
		if (!isEmpty(firstChunk.slice(0, offset))) {
			continue;
		}
		// we mark the next <counts[0]> fields as marked, and it must be followed by at least one empty field
		if (firstChunk[offset + firstCount]) {
			continue;
		}

		const reducedChunk = firstChunk.slice(offset + firstCount + 1);

		res += countOptions([reducedChunk, ...chunks.slice(1)], counts.slice(1));
	}

	return res;
};

const lines = readLines(import.meta.url, "input.txt")
	.map((l) => l.trim())
	.filter(Boolean)
	.map(parseLine);

console.log(
	sum(lines.map(({ chunks, counts }) => countOptions(chunks, counts)))
);
