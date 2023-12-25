import { readLines } from "../lib/index.js";

export const getGraph = (metaUrl: string, fileName: string) => {
	const vertexes = new Array<string>();
	const adjacency: number[][] = [];

	const addVertex = (v: string) => {
		let i = vertexes.indexOf(v);
		if (i >= 0) return i;
		vertexes.push(v);
		while (adjacency.length < vertexes.length) {
			for (const row of adjacency) {
				row.push(0);
			}
			adjacency.push(Array.from({ length: vertexes.length }, () => 0));
		}
		return vertexes.length - 1;
	};

	const parseLine = (line: string) => {
		const [from, tosStr] = line.split(": ");
		const tos = tosStr!.split(" ");
		const i = addVertex(from!);
		for (const to of tos) {
			const j = addVertex(to);
			adjacency[i]![j] = 1;
			adjacency[j]![i] = 1;
		}
	};

	readLines(metaUrl, fileName)
		.map((l) => l.trim())
		.filter(Boolean)
		.forEach(parseLine);

	return { vertexes, adjacency };
};
