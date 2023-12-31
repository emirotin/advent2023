export type Coords = readonly [number, number];

type MapUnit = ('.' | '#' | number)[][];

export const getData = (input: string) => {
	let start: Coords | null = null;

	const parseLine = (line: string, i: number) =>
		line.split('').map((ch, j) => {
			if (ch === 'S') {
				start = [i, j];
				return '.';
			}
			return ch === '#' ? '#' : '.';
		});

	const map = input
		.trim()
		.split('\n')
		.map((l) => l.trim())
		.filter(Boolean)
		.map(parseLine);

	const rows = map.length;
	const cols = map[0]!.length;

	if (rows !== cols) throw new Error('Not square');
	if (rows % 2 === 0) throw new Error('Even side');
	if (!start) throw new Error('No start marker');
	if (start[0] !== (rows - 1) / 2 || start[0] !== start[1]) throw new Error('Not centered');

	const size = rows;

	const sideRange = Array.from({ length: size }, (_, i) => i);
	if (
		!(
			sideRange.every((c) => map[0]![c] === '.') &&
			sideRange.every((c) => map[size - 1]![c] === '.') &&
			sideRange.every((r) => map[r]![0] === '.') &&
			sideRange.every((r) => map[r]![size - 1] === '.')
		)
	)
		throw new Error('Meh, my algo is hard-wired to these assumptions');

	return { map, size, start: start as Coords };
};

export type MapData = ReturnType<typeof getData>;

export const neighbors = (map: MapUnit, size: number, [r, c]: Coords) => {
	return [
		[r - 1, c] as const,
		[r + 1, c] as const,
		[r, c - 1] as const,
		[r, c + 1] as const
	].filter(([r, c]) => r >= 0 && r < size && c >= 0 && c < size && map[r]![c] === '.');
};

export const cloneMap = (map: MapUnit) => map.map((r) => r.slice());

const multiplyArray = <T>(arr: T[], n: number) => {
	const size = arr.length;
	return Array.from({ length: size * n }, (_, i) => structuredClone(arr[i % size]));
};

export const multiplyMap = (map: MapUnit, n: number) =>
	multiplyArray(
		map.map((r) => multiplyArray(r, n)),
		n
	);

export const sliceMap = (map: MapUnit, n: number) => {
	const size = map.length;
	const res = Array.from({ length: n }, () => Array.from({ length: n }));
	const partSize = size / n;
	for (let j = 0; j < n; j++) {
		for (let i = 0; i < n; i++) {
			res[j]![i] = map
				.slice(j * partSize, (j + 1) * partSize)
				.map((r) => r.slice(i * partSize, (i + 1) * partSize));
		}
	}
	return res as MapUnit[][];
};

export const calcPaths = (map: MapUnit, size: number, start: Coords) => {
	map[start[0]]![start[1]] = 0;
	const checkNext = [start];
	let coords: Coords | undefined;
	while ((coords = checkNext.shift())) {
		const n = map[coords[0]]![coords[1]] as number;
		for (const [r, c] of neighbors(map, size, coords)) {
			if (map[r]![c] === '.') {
				map[r]![c] = n + 1;
				checkNext.push([r, c]);
			}
		}
	}

	const numbers = map.flatMap((r) => r).filter((n) => typeof n === 'number') as number[];
	const odds = numbers.filter((n) => n % 2 === 1).length;
	const evens = numbers.filter((n) => n % 2 === 0).length;
	const minPath = Math.min(...numbers);
	const maxPath = Math.max(...numbers);

	return {
		map: map as ('#' | number)[][],
		numbers,
		odds,
		evens,
		minPath,
		maxPath
	};
};

export type PathInfo = ReturnType<typeof calcPaths>;

export const sign = (x: number) => (x > 0 ? 1 : x < 0 ? -1 : 0);
