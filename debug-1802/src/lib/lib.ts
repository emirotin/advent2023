export type Direction = 'n' | 's' | 'w' | 'e';
export type InputDir = 'U' | 'D' | 'L' | 'R';

export type Step = {
	d: Direction;
	n: number;
};

export type Segment = {
	d: Direction;
	n: number;
	xmin: number;
	xmax: number;
	ymin: number;
	ymax: number;
};

const charToDirection: Record<InputDir, Direction> = {
	U: 'n',
	D: 's',
	L: 'w',
	R: 'e'
};

const encodedDirections = ['R', 'D', 'L', 'U'] as const;

export const parseInstr = ({ newMode }: { newMode: boolean }) =>
	newMode
		? (s: string): Step => {
				const parts = s.split(' ')[2]!.slice(2, -1);
				const i = parseInt(parts.slice(-1));
				return {
					d: charToDirection[encodedDirections[i]!],
					n: parseInt('0x' + parts.slice(0, -1))
				};
			}
		: (s: string): Step => {
				const parts = s.split(' ');
				return {
					d: charToDirection[parts[0] as InputDir],
					n: parseInt(parts[1]!)
				};
			};

export const isRightTurn = (s1: Segment, s2: Segment) => {
	const d1 = s1.d;
	const d2 = s2.d;

	return (
		(d1 === 'e' && d2 === 's') ||
		(d1 === 's' && d2 === 'w') ||
		(d1 === 'w' && d2 === 'n') ||
		(d1 === 'n' && d2 === 'e')
	);
};

export const stepsToSegments = (steps: Step[]): Segment[] => {
	const segments: Segment[] = steps.map((s) => ({
		...s,
		xmin: 0,
		xmax: 0,
		ymin: 0,
		ymax: 0
	}));

	for (let i = 0; i < segments.length; i++) {
		const s1 = segments[i]!;
		const s2 = segments[(i + 1) % segments.length]!;
		if (isRightTurn(s1, s2)) {
			s2.n += 1;
		} else {
			s1.n -= 1;
		}
	}

	let x = 0;
	let y = 0;

	for (let i = 0; i < segments.length; i++) {
		const s = segments[i]!;
		const xOrig = x;
		const yOrig = y;
		switch (s.d) {
			case 'e':
				x += s.n;
				break;
			case 'w':
				x -= s.n;
				break;
			case 'n':
				y -= s.n;
				break;
			case 's':
				y += s.n;
				break;
		}
		s.xmin = Math.min(x, xOrig);
		s.xmax = Math.max(x, xOrig);
		s.ymin = Math.min(y, yOrig);
		s.ymax = Math.max(y, yOrig);
	}

	return segments;
};

export const areOpposite = (s1: Segment, s2: Segment) => {
	const d1 = s1.d;
	const d2 = s2.d;

	if (
		!(
			(d1 === 'n' && d2 === 's') ||
			(d1 === 's' && d2 === 'n') ||
			(d1 === 'w' && d2 === 'e') ||
			(d1 === 'e' && d2 === 'w')
		)
	)
		return undefined;

	// debugger;
	const n1 = s1.n;
	const n2 = s2.n;
	const diff = Math.abs(n1 - n2);

	let xFrom, xTo, yFrom, yTo;

	switch (d1) {
		case 's':
			xFrom = xTo = s1.xmin;
			yFrom = s1.ymin;
			yTo = s1.ymax - n2;
			break;
		case 'n':
			xFrom = xTo = s1.xmin;
			yFrom = s1.ymax;
			yTo = s1.ymin + n2;
			break;
		case 'e':
			yFrom = yTo = s1.ymin;
			xFrom = s1.xmin;
			xTo = s1.xmax - n2;
			break;
		case 'w':
			yFrom = yTo = s1.ymin;
			xFrom = s1.xmax;
			xTo = s2.xmin + n2;
			break;
	}

	return {
		n: diff,
		d: n1 > n2 ? d1 : d2,
		xmin: Math.min(xFrom, xTo),
		xmax: Math.max(xFrom, xTo),
		ymin: Math.min(yFrom, yTo),
		ymax: Math.max(yFrom, yTo)
	};
};

export const isNot =
	<T>(a: T) =>
	(b: T) =>
		b !== a;

export const isVert = (s: Segment) => s.d === 'n' || s.d === 's';
export const isHoriz = (s: Segment) => s.d === 'w' || s.d === 'e';

export const intersects = (a: [number, number], b: [number, number]) => b[0] < a[1] && b[1] > a[0];
