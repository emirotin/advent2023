import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export const getDirname = (metaUrl: string) => path.dirname(fileURLToPath(metaUrl));

export const getFilePath = (metaUrl: string, fileName: string) => {
	return path.join(getDirname(metaUrl), fileName);
};

export const readFile = (metaUrl: string, fileName: string) => {
	return fs.readFileSync(getFilePath(metaUrl, fileName), 'utf-8');
};

export const readLines = (metaUrl: string, fileName: string) => {
	return readFile(metaUrl, fileName).split('\n');
};

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
	if (s2.n > s1.n) {
		const swap = s2;
		s2 = s1;
		s1 = swap;
	}

	const d1 = s1.d;
	const n1 = s1.n;
	const d2 = s2.d;
	const n2 = s2.n;

	if (
		!(
			(d1 === 'n' && d2 === 's') ||
			(d1 === 's' && d2 === 'n') ||
			(d1 === 'w' && d2 === 'e') ||
			(d1 === 'e' && d2 === 'w')
		)
	)
		return undefined;

	const diff = Math.abs(n1 - n2);

	let xmin, xmax, ymin, ymax;

	switch (d1) {
		case 's':
			xmin = xmax = s1.xmin;
			ymin = s1.ymin;
			ymax = ymin + diff;
			break;
		case 'n':
			xmin = xmax = s1.xmin;
			ymax = s1.ymax;
			ymin = ymax - diff;
			break;
		case 'e':
			ymin = ymax = s1.ymin;
			xmin = s1.xmin;
			xmax = xmin + diff;
			break;
		case 'w':
			ymin = ymax = s1.ymin;
			xmax = s1.xmax;
			xmin = xmax - diff;
			break;
	}

	return {
		n: diff,
		d: d1,
		xmin,
		xmax,
		ymin,
		ymax
	};
};

export const isNot =
	<T>(a: T) =>
	(b: T) =>
		b !== a;

export const isVert = (s: Segment) => s.d === 'n' || s.d === 's';
export const isHoriz = (s: Segment) => s.d === 'w' || s.d === 'e';

export const intersects = (a: [number, number], b: [number, number]) => b[0] < a[1] && b[1] > a[0];
