import { readLines, parseNums } from "../lib/index.js";

export type Brick = {
	xmin: number;
	xmax: number;
	ymin: number;
	ymax: number;
	zmin: number;
	zmax: number;
	id: string;
	supportedBy: string[];
};

const parseLine = (line: string) => {
	const [min, max] = line.split("~").map((s) => parseNums(s, ","));
	return {
		xmin: min![0]!,
		ymin: min![1]!,
		zmin: min![2]!,
		xmax: max![0]!,
		ymax: max![1]!,
		zmax: max![2]!,
		id: Math.random().toString().slice(2),
		supportedBy: [] as string[],
	} satisfies Brick;
};

const intersects = (a: [number, number], b: [number, number]) => {
	return b[0] <= a[1] && b[1] >= a[0];
};

export const getBricks = (metaUrl: string, fileName: string) => {
	const bricks = readLines(metaUrl, fileName)
		.map((l) => l.trim())
		.filter(Boolean)
		.map(parseLine)
		.sort((a, b) => a.zmin - b.zmin);

	const settledBricks: Brick[] = [];

	while (bricks.length) {
		const brick = bricks.shift()!;
		const intersectingBricks = settledBricks.filter(
			(b) =>
				intersects([b.xmin, b.xmax], [brick.xmin, brick.xmax]) &&
				intersects([b.ymin, b.ymax], [brick.ymin, brick.ymax])
		);
		const maxZ = intersectingBricks.length
			? Math.max(...intersectingBricks.map((b) => b.zmax))
			: 0;
		brick.supportedBy = intersectingBricks
			.filter((b) => b.zmax === maxZ)
			.map((b) => b.id);
		const d = brick.zmin - maxZ - 1;
		brick.zmin -= d;
		brick.zmax -= d;
		settledBricks.push(brick);
	}

	return settledBricks;
};
