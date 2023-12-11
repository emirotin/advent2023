export type Char = "." | "#";
export type Coords = { r: number; c: number };

export const parseLine = (line: string) => line.trim().split("") as Char[];

export function* findGalaxies(matrix: Char[][]): Generator<Coords> {
	let rows = matrix.length;
	let cols = matrix[0]!.length;

	for (let r = 0; r < rows; r++) {
		for (let c = 0; c < cols; c++) {
			if (matrix[r]![c]! === "#") {
				yield { r, c };
			}
		}
	}
}

export const findExpandedGalaxies = (
	matrix: Char[][],
	expansionFactor: number
) => {
	let rows = matrix.length;
	let cols = matrix[0]!.length;

	const galaxies = [...findGalaxies(matrix)];
	const expandedGalaxies = galaxies.map((g) => ({ r: g.r, c: g.c }));

	for (let r = 0; r < rows; r++) {
		if (galaxies.find((g) => g.r === r)) continue;

		for (let i = 0; i < galaxies.length; i++) {
			if (galaxies[i]!.r > r) {
				expandedGalaxies[i]!.r += expansionFactor - 1;
			}
		}
	}

	for (let c = 0; c < cols; c++) {
		if (galaxies.find((g) => g.c === c)) continue;

		for (let i = 0; i < galaxies.length; i++) {
			if (galaxies[i]!.c > c) {
				expandedGalaxies[i]!.c += expansionFactor - 1;
			}
		}
	}

	return expandedGalaxies;
};

const dist = (p1: Coords, p2: Coords) =>
	Math.abs(p1.r - p2.r) + Math.abs(p1.c - p2.c);

export const countDistances = (galaxies: Coords[]) => {
	let res = 0;
	for (let i = 0; i < galaxies.length - 1; i++) {
		for (let j = i + 1; j < galaxies.length; j++) {
			res += dist(galaxies[i]!, galaxies[j]!);
		}
	}

	return res;
};
