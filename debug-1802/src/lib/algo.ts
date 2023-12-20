import { areOpposite, intersects, isHoriz, isNot, isRightTurn, isVert, type Segment } from './lib';

const removeUnneededSegments = (segments: Segment[]) => {
	let changed = false;

	do {
		// remove empty segments
		const n = segments.length;
		segments = segments.filter(({ n }) => n > 0);
		changed = segments.length < n;

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
				changed = true;
			} else if ((diff = areOpposite(s1, s2))) {
				Object.assign(s2, diff);
				segments.splice(i, 1);
				changed = true;
			} else {
				i += 1;
			}
		}
	} while (changed);
};

const cutBump = (segments: Segment[], i2: number) => {
	const i1 = (i2 - 1 + segments.length) % segments.length;
	const i3 = (i2 + 1) % segments.length;
	const s1 = segments[i1]!;
	const s2 = segments[i2]!;
	const s3 = segments[i3]!;

	if (!isRightTurn(s1, s2) || !isRightTurn(s2, s3)) {
		return 0;
	}

	let closestEdge: number = 0;
	switch (s2.d) {
		case 's': {
			let otherEdges = segments
				.filter(isNot(s2))
				.filter(isVert)
				.filter((s) => intersects([s1.ymin, s3.ymin], [s.ymin, s.ymax]))
				.filter((s) => s.xmin <= s2.xmin);
			closestEdge = Math.max(...otherEdges.map(({ xmin }) => xmin));
			break;
		}
		case 'n': {
			let otherEdges = segments
				.filter(isNot(s2))
				.filter(isVert)
				.filter((s) => intersects([s1.ymin, s3.ymin], [s.ymin, s.ymax]))
				.filter((s) => s.xmin >= s2.xmin);
			closestEdge = Math.min(...otherEdges.map(({ xmin }) => xmin));
			break;
		}
		case 'e': {
			let otherEdges = segments
				.filter(isNot(s2))
				.filter(isHoriz)
				.filter((s) => intersects([s1.xmin, s3.xmin], [s.xmin, s.xmax]))
				.filter((s) => s.ymin >= s2.ymin);
			closestEdge = Math.min(...otherEdges.map(({ ymin }) => ymin));
			break;
		}
		case 'w': {
			let otherEdges = segments
				.filter(isNot(s2))
				.filter(isHoriz)
				.filter((s) => intersects([s1.xmin, s3.xmin], [s.xmin, s.xmax]))
				.filter((s) => s.ymin <= s2.ymin);
			closestEdge = Math.max(...otherEdges.map(({ ymin }) => ymin));
			break;
		}
	}

	const m = Math.min(s1.n, s3.n, Math.abs(closestEdge - (isVert(s2) ? s2.xmin : s2.ymin)));
	if (m == 0) {
		return 0;
	}

	s1.n -= m;
	s3.n -= m;
	const add = m * s2.n;

	switch (s2.d) {
		case 'n':
			s2.xmin += m;
			s2.xmax += m;
			break;
		case 's':
			s2.xmin -= m;
			s2.xmax -= m;
			break;
		case 'w':
			s2.ymin -= m;
			s2.ymax -= m;
			break;
		case 'e':
			s2.ymin += m;
			s2.ymax += m;
			break;
	}

	removeUnneededSegments(segments);

	return add;
};

function* findIndicesGen<T>(a: T[], pred: (x: T) => boolean) {
	for (let i = 0; i < a.length; i++) {
		if (pred(a[i]!)) yield i;
	}
}

const findIndices = <T>(a: T[], pred: (x: T) => boolean) => [...findIndicesGen(a, pred)];

const cutOneBump = (segments: Segment[], indices: number[]) => {
	let add = 0;
	for (const i of indices) {
		if ((add = cutBump(segments, i))) return add;
	}
	return 0;
};

const cutNorth = (segments: Segment[]) => {
	const horizSegments = segments.filter(isHoriz);
	if (!horizSegments.length) return 0;

	const minY = Math.min(...horizSegments.map((s) => s.ymin));
	const indices = findIndices(segments, (s) => isHoriz(s) && s.ymin === minY);
	return cutOneBump(segments, indices);
};

const cutSouth = (segments: Segment[]) => {
	const horizSegments = segments.filter(isHoriz);
	if (!horizSegments.length) return 0;

	const maxY = Math.max(...horizSegments.map((s) => s.ymax));
	const indices = findIndices(segments, (s) => isHoriz(s) && s.ymax === maxY);
	return cutOneBump(segments, indices);
};

const cutEast = (segments: Segment[]) => {
	const vertSegments = segments.filter(isVert);
	if (!vertSegments.length) return 0;

	const maxX = Math.max(...vertSegments.map((s) => s.xmax));
	const indices = findIndices(segments, (s) => isVert(s) && s.xmax === maxX);
	return cutOneBump(segments, indices);
};

const cutWest = (segments: Segment[]) => {
	const vertSegments = segments.filter(isVert);
	if (!vertSegments.length) return 0;

	const minX = Math.min(...vertSegments.map((s) => s.xmin));
	const indices = findIndices(segments, (s) => isVert(s) && s.xmin === minX);
	return cutOneBump(segments, indices);
};

export const run = (segments: Segment[]) => {
	let result = 0;

	while (segments.length) {
		result += cutNorth(segments);
		result += cutEast(segments);
		result += cutSouth(segments);
		result += cutWest(segments);
	}

	return result;
};
