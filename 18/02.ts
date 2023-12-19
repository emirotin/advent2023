import { readLines } from "../lib/index.js";
import {
	areOpposite,
	intersects,
	isHoriz,
	isNot,
	isRightTurn,
	isVert,
	parseInstr,
	stepsToSegments,
} from "./lib.js";

let steps = readLines(import.meta.url, "input.txt")
	.map((l) => l.trim())
	.filter(Boolean)
	.map(parseInstr({ newMode: true }));

let segments = stepsToSegments(steps);

let result = 0;

while (segments.length) {
	// cut extending rects
	for (let i = 0; i < segments.length; i++) {
		const s1 = segments[i]!;
		const s2 = segments[(i + 1) % segments.length]!;
		const s3 = segments[(i + 2) % segments.length]!;
		if (!isRightTurn(s1, s2) || !isRightTurn(s2, s3)) {
			continue;
		}

		let closestEdge: number = 0;
		switch (s2.d) {
			case "s": {
				let otherEdges = segments
					.filter(isNot(s2))
					.filter(isVert)
					.filter((s) => intersects([s1.ymin, s3.ymin], [s.ymin, s.ymax]))
					.filter((s) => s.xmin <= s2.xmin);
				closestEdge = Math.max(...otherEdges.map(({ xmin }) => xmin));
				break;
			}
			case "n": {
				let otherEdges = segments
					.filter(isNot(s2))
					.filter(isVert)
					.filter((s) => intersects([s1.ymin, s3.ymin], [s.ymin, s.ymax]))
					.filter((s) => s.xmin >= s2.xmin);
				closestEdge = Math.min(...otherEdges.map(({ xmin }) => xmin));
				break;
			}
			case "e": {
				let otherEdges = segments
					.filter(isNot(s2))
					.filter(isHoriz)
					.filter((s) => intersects([s1.xmin, s3.xmin], [s.xmin, s.xmax]))
					.filter((s) => s.ymin >= s2.ymin);
				closestEdge = Math.min(...otherEdges.map(({ ymin }) => ymin));
				break;
			}
			case "w": {
				let otherEdges = segments
					.filter(isNot(s2))
					.filter(isHoriz)
					.filter((s) => intersects([s1.xmin, s3.xmin], [s.xmin, s.xmax]))
					.filter((s) => s.ymin <= s2.ymin);
				closestEdge = Math.max(...otherEdges.map(({ ymin }) => ymin));
				break;
			}
		}

		const m = Math.min(
			s1.n,
			s3.n,
			Math.abs(closestEdge - (isVert(s2) ? s2.xmin : s2.ymin))
		);
		if (m == 0) {
			continue;
		}

		s1.n -= m;
		s3.n -= m;
		result += m * s2.n;

		switch (s2.d) {
			case "n":
				s2.xmin += m;
				s2.xmax += m;
				break;
			case "s":
				s2.xmin -= m;
				s2.xmax -= m;
				break;
			case "w":
				s2.ymin -= m;
				s2.ymax -= m;
				break;
			case "e":
				s2.ymin += m;
				s2.ymax += m;
				break;
		}
	}

	// remove empty segments
	segments = segments.filter(({ n }) => n > 0);
	// merge subsequent segments
	let i = 0;
	let diff;
	while (i < segments.length - 1) {
		const s1 = segments[i]!;
		const s2 = segments[(i + 1) % segments.length]!;
		if (s1.d === s2.d) {
			s2.n += s1.n;
			s2.xmin = Math.min(s1.xmin, s2.xmin);
			s2.xmax = Math.max(s1.xmax, s2.xmax);
			s2.ymin = Math.min(s1.ymin, s2.ymin);
			s2.ymax = Math.max(s1.ymax, s2.ymax);
			segments.splice(i, 1);
		} else if ((diff = areOpposite(s1, s2))) {
			Object.assign(s2, diff);
			segments.splice(i, 1);
		} else {
			i += 1;
		}
	}
	segments = segments.filter(({ n }) => n > 0);
}

console.log(result);
// console.log(segments);
