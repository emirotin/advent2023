import { parseNums, readLines, sum } from "../lib/index.js";

export type Chunk = (true | undefined)[];

export const parseLine = (line: string) => {
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

export const isEmpty = (chunk: Chunk) => chunk.every((x) => x === undefined);

const cache: Record<string, number> = {};

export const countOptions = (chunks: Chunk[], counts: number[]): number => {
	const key =
		chunks
			.map((chunk) => chunk.map((c) => Number(c ?? false)).join(""))
			.join("|") +
		" " +
		counts.join(",");

	if (cache[key]) {
		return cache[key]!;
	}

	// place nothing among 0 or more chunks
	// - one way if all remaining chunks are empty
	// - no way if some of them must contain a mark
	if (counts.length === 0) return chunks.every(isEmpty) ? 1 : 0;
	// still have counts but no chunks = 0 ways
	if (chunks.length === 0) return 0;

	const firstCount = counts[0]!;

	// if there's one count, it goes into one chunk exactly
	// so, avoid recursion
	// if (counts.length === 1) {
	// 	return sum(
	// 		chunks.map((chunk) => {
	// 			if (chunk.length < firstCount) {
	// 				return 0;
	// 			}

	// 			const leftmostMark = chunk.findIndex((x) => x === true);
	// 			// chunk is empty
	// 			if (leftmostMark < 0) {
	// 				return chunk.length - firstCount + 1;
	// 			}

	// 			const rightmostMark = chunk.findLastIndex((x) => x === true);

	// 			const minStart = Math.max(0, rightmostMark - firstCount + 1);
	// 			const maxStart = Math.min(leftmostMark, chunk.length - firstCount);

	// 			return maxStart - minStart + 1;
	// 		})
	// 	);
	// }

	// // split the counts on the max element
	// const maxCount = Math.max(...counts);
	// if (maxCount > 3) {
	// 	const maxCountIndex = counts.findIndex((x) => x === maxCount);
	// 	const leftCounts = counts.slice(0, maxCountIndex);
	// 	const rightCounts = counts.slice(maxCountIndex + 1);

	// 	let res = 0;
	// 	for (let i = 0; i < chunks.length; i++) {
	// 		if (chunks[i]!.length < maxCount) {
	// 			continue;
	// 		}
	// 		res +=
	// 			countOptions(chunks.slice(0, i), leftCounts) *
	// 			countOptions([chunks[i]!], [maxCount]) *
	// 			countOptions(chunks.slice(i + 1), rightCounts);
	// 	}

	// 	cache[key] = res;
	// 	return res;
	// }

	const firstChunk = chunks[0]!;

	// if the first chunk is empty one option is there are no marks inside
	let res = isEmpty(firstChunk) ? countOptions(chunks.slice(1), counts) : 0;

	// then consider every option how the first count can be placed inside of the first chunk
	for (let offset = 0; offset <= firstChunk.length - firstCount; offset++) {
		// our assumption is we consider first <offset> fields as unmarked
		if (!isEmpty(firstChunk.slice(0, offset))) {
			continue;
		}
		// we mark the next <counts[0]> fields as marked,
		// and this streak must be followed by at least one empty field
		if (firstChunk[offset + firstCount]) {
			continue;
		}

		const reducedChunk = firstChunk.slice(offset + firstCount + 1);

		res += countOptions([reducedChunk, ...chunks.slice(1)], counts.slice(1));
	}

	cache[key] = res;
	return res;
};
