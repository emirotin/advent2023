import { getBricks } from "./lib.js";

const bricks = getBricks(import.meta.url, "input.txt");

console.log(
	bricks.filter(
		(brick) =>
			bricks.filter(
				(b) => b.supportedBy.length === 1 && b.supportedBy[0] === brick.id
			).length === 0
	).length
);
