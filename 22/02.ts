import { sum } from "../lib/index.js";
import { getBricks } from "./lib.js";

const bricks = getBricks(import.meta.url, "input.txt");

const supportedOnlyBy = (brickIds: string[]) => {
	const res = bricks
		.filter(
			(b) =>
				!brickIds.includes(b.id) &&
				b.supportedBy.length > 0 &&
				b.supportedBy.every((id) => brickIds.includes(id))
		)
		.map((b) => b.id);

	return res;
};

const willFail = (brickId: string): number => {
	let res = 0;
	const alreadyDisintegrated = [brickId];
	while (true) {
		const willChain = supportedOnlyBy(alreadyDisintegrated);
		res += willChain.length;
		alreadyDisintegrated.push(...willChain);
		if (willChain.length === 0) return res;
	}
};

console.log(sum(bricks.map((b) => b.id).map(willFail)));
