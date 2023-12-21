import {
	areOpposite,
	contains,
	intersects,
	isHoriz,
	isNot,
	isRightTurn,
	isVert,
	split,
	eq,
	start,
	end,
	type Segment
} from './lib';

export function* run(initialSegments: Segment[]) {
	let loops = [initialSegments];

	const checkSegmentsConnectivity = (segments: Segment[]) => {
		for (let i = 0; i < segments.length; i++) {
			const s1 = segments[i]!;
			const s2 = segments[(i + 1) % segments.length]!;

			if (!eq(end(s1), start(s2))) {
				// console.log('DETACHED!');
				// console.dir(segments);
				return false;
			}
		}
		return true;
	};

	const checkConnectivity = () => {
		for (const segments of loops) {
			if (!checkSegmentsConnectivity(segments)) {
				return false;
			}
		}
		return true;
	};

	const cleanupSegment = (sn: number) => {
		const n = loops[sn].length;
		loops[sn] = loops[sn].filter(({ n }) => n > 0);
		return loops[sn].length < n;
	};

	const cleanupEmpty = () => {
		let changed = false;
		for (let sn = 0; sn < loops.length; sn++) {
			changed ||= cleanupSegment(sn);
		}
		const n = loops.length;
		loops = loops.filter((l) => l.length > 0);
		return changed || loops.length < n;
	};

	const mergeAdjacent = () => {
		let changed = false;

		for (let sn = 0; sn < loops.length; sn++) {
			let iterChanged = false;

			do {
				iterChanged = false;
				const segments = loops[sn]!;

				// merge subsequent segments
				let i = 0;
				let diff;
				while (i < segments.length) {
					const s1 = segments[i]!;
					const s2 = segments[(i + 1) % segments.length]!;
					if (s1.d === s2.d) {
						s2.n += s1.n;
						s2.xmin = Math.min(s1.xmin, s2.xmin);
						s2.xmax = Math.max(s1.xmax, s2.xmax);
						s2.ymin = Math.min(s1.ymin, s2.ymin);
						s2.ymax = Math.max(s1.ymax, s2.ymax);
						segments.splice(i, 1);
						iterChanged = true;
					} else if ((diff = areOpposite(s1, s2))) {
						Object.assign(s2, diff);
						segments.splice(i, 1);
						iterChanged = true;
					} else {
						i += 1;
					}
				}

				changed ||= iterChanged;
				cleanupSegment(sn);
			} while (iterChanged);
		}

		return changed;
	};

	const splitOverlappingSegments = () => {
		let changed = false;

		for (let sn = 0; sn < loops.length; sn++) {
			// split segments that contain other segments, also extract detached loops
			for (let i = 0; i < loops[sn].length - 1; i++) {
				for (let j = i + 1; j < loops[sn].length; j++) {
					const s1 = loops[sn][i]!;
					const s2 = loops[sn][j]!;

					if (!areOpposite(s1, s2)) continue;

					if (contains(s1, s2)) {
						const newSegments = split(s1, s2);
						loops[sn].splice(i, 1, ...newSegments);
						i += newSegments.length - 1;
						j += newSegments.length - 1;
						changed = true;
					} else if (contains(s2, s1)) {
						const newSegments = split(s2, s1);
						loops[sn].splice(j, 1, ...newSegments);
						j += newSegments.length - 1;
						changed = true;
					}
				}
			}
		}

		return changed;
	};

	const extractDetachedLoops = () => {
		let changed = splitOverlappingSegments();

		for (let sn = 0; sn < loops.length; sn++) {
			const extractions = [];

			for (let i = 0; i < loops[sn].length - 1; i++) {
				for (let j = i + 2; j < loops[sn].length; j++) {
					const s1 = loops[sn][i]!;
					const s2 = loops[sn][j]!;

					if (
						!(i === 0 && j === loops[sn].length - 1) &&
						eq(end(s2), start(s1)) &&
						isRightTurn(s2, s1)
					) {
						extractions.unshift([i, j] as const);
						i = j;
						break;
					}
				}
			}

			changed ||= extractions.length > 0;

			for (const [i, j] of extractions) {
				const newLoop = loops[sn].splice(i, j - i + 1);
				if (!checkSegmentsConnectivity(newLoop)) {
					console.log('aaaaa');
				}
				if (!checkSegmentsConnectivity(loops[sn])) {
					console.log('bbbbb');
				}
				loops.push(newLoop);
			}
		}

		return changed;
	};

	const removeUnneededSegments = () => {
		let changed = false;

		// if (!checkConnectivity()) {
		// 	console.log(0);
		// }

		do {
			changed = cleanupEmpty();
			// if (!checkConnectivity()) {
			// 	console.log(1);
			// }

			const squashed = mergeAdjacent();
			// if (!checkConnectivity()) {
			// 	console.log(2);
			// }

			changed ||= squashed;
			const extracted = extractDetachedLoops();
			// if (!checkConnectivity()) {
			// 	console.log(3);
			// }

			changed ||= extracted;
			if (extracted) {
				cleanupEmpty();
				// if (!checkConnectivity()) {
				// 	console.log(4);
				// }
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
					.filter((s) => intersects([s3.ymin, s1.ymin], [s.ymin, s.ymax]))
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
					.filter((s) => intersects([s3.xmin, s1.xmin], [s.xmin, s.xmax]))
					.filter((s) => s.ymax <= s2.ymax);
				closestEdge = Math.max(...otherEdges.map(({ ymax }) => ymax));
				break;
			}
		}

		const m = Math.min(s1.n, s3.n, Math.abs(closestEdge - (isVert(s2) ? s2.xmin : s2.ymin)));
		if (m <= 0) {
			return 0;
		}

		s1.n -= m;
		s3.n -= m;

		const add = m * s2.n;

		switch (s2.d) {
			case 'n': {
				const x = s2.xmin + m;
				s1.xmin = s3.xmin = s2.xmin = s2.xmax = x;
				break;
			}
			case 's': {
				const x = s2.xmin - m;
				s1.xmax = s3.xmax = s2.xmin = s2.xmax = x;
				break;
			}
			case 'w': {
				const y = s2.ymin - m;
				s1.ymax = s3.ymax = s2.ymin = s2.ymax = y;
				break;
			}
			case 'e': {
				const y = s2.ymin + m;
				s1.ymin = s3.ymin = s2.ymin = s2.ymax = y;
				break;
			}
		}

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
			if ((add = cutBump(segments, i))) {
				return add;
			}
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

	let result = 0;

	while (loops.length) {
		cleanupEmpty();

		for (let sn = 0; sn < loops.length; sn++) {
			const segments = loops[sn]!;

			result += cutNorth(segments);
			yield { loops, result };
			result += cutEast(segments);
			yield { loops, result };
			result += cutSouth(segments);
			yield { loops, result };
			result += cutWest(segments);
			yield { loops, result };
		}

		removeUnneededSegments();
	}

	yield { loops, result };
}
