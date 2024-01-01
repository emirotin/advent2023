import { parseNums } from "../lib/index.js";

export type Vector = [number, number, number];

export type Obj = {
	coords: Vector;
	velocities: Vector;
	index: number;
};

export const parseLine = (line: string, i: number): Obj => {
	const parts = line.split(" @ ");
	const coords = parseNums(parts[0]!, ", ") as unknown as Vector;
	const velocities = parseNums(parts[1]!, ", ") as unknown as Vector;
	return { coords, velocities, index: i };
};

/**
 * Gauss-Jordan elimination
 * Adapted from https://github.com/lovasoa/linear-solve/blob/master/gauss-jordan.js
 */

export type LinMatrix = number[][];
export type LinVector = number[];

/**
 * Used internally to solve systems
 * If you want to solve A.x = B,
 * choose data=A and mirror=B.
 * mirror can be either an array representing a vector
 * or an array of arrays representing a matrix.
 */
class Mat {
	data: LinMatrix;
	mirror?: Mat;

	constructor(data: LinMatrix, mirror?: LinVector | LinVector[]) {
		// Clone the original matrix
		this.data = new Array(data.length);
		for (let i = 0, cols = data[0]!.length; i < data.length; i++) {
			this.data[i] = new Array(cols);
			for (let j = 0; j < cols; j++) {
				this.data[i]![j] = data[i]![j]!;
			}
		}

		if (mirror) {
			if (typeof mirror[0] === "number") {
				for (let i = 0; i < mirror.length; i++) {
					mirror[i] = [mirror[i] as number];
				}
			}
			this.mirror = new Mat(mirror as LinMatrix);
		}
	}

	/**
	 * Swap lines i and j in the matrix
	 */
	swap(i: number, j: number) {
		if (this.mirror) this.mirror.swap(i, j);
		let tmp = this.data[i]!;
		this.data[i] = this.data[j]!;
		this.data[j] = tmp;
	}

	/**
	 * Multiply line number i by l
	 */
	multLine(i: number, l: number) {
		if (this.mirror) this.mirror.multLine(i, l);
		let line = this.data[i]!;
		for (let k = line.length - 1; k >= 0; k--) {
			line[k] *= l;
		}
	}

	/**
	 * Add line number j multiplied by l to line number i
	 */
	addMul(i: number, j: number, l: number) {
		if (this.mirror) this.mirror.addMul(i, j, l);
		let lineI = this.data[i]!,
			lineJ = this.data[j]!;
		for (let k = lineI.length - 1; k >= 0; k--) {
			lineI[k] = lineI[k]! + l * lineJ[k]!;
		}
	}

	/**
	 * Tests if line number i is composed only of zeroes
	 */
	hasNullLine(i: number) {
		for (let j = 0; j < this.data[i]!.length; j++) {
			if (this.data[i]![j] !== 0) {
				return false;
			}
		}
		return true;
	}

	gauss() {
		if (!this.mirror) throw new Error("No mirror");

		let pivot = 0,
			lines = this.data.length,
			columns = this.data[0]!.length,
			nullLines = [];

		for (let j = 0; j < columns; j++) {
			// Find the line on which there is the maximum value of column j
			let maxValue = 0,
				maxLine = 0;
			for (let k = pivot; k < lines; k++) {
				let val = this.data[k]![j]!;
				if (Math.abs(val) > Math.abs(maxValue)) {
					maxLine = k;
					maxValue = val;
				}
			}
			if (maxValue === 0) {
				// The matrix is not invertible. The system may still have solutions.
				nullLines.push(pivot);
			} else {
				// The value of the pivot is maxValue
				this.multLine(maxLine, 1 / maxValue);
				this.swap(maxLine, pivot);
				for (let i = 0; i < lines; i++) {
					if (i !== pivot) {
						this.addMul(i, pivot, -this.data[i]![j]!);
					}
				}
			}
			pivot++;
		}

		// Check that the system has null lines where it should
		for (let i = 0; i < nullLines.length; i++) {
			if (!this.mirror.hasNullLine(nullLines[i]!)) {
				throw new Error("singular matrix");
			}
		}
		return this.mirror.data;
	}
}

/**
 * Solves A.x = b
 * @param A
 * @param b
 * @return x
 */
export function solve(A: LinMatrix, b: LinVector | LinVector[]) {
	let result = new Mat(A, b).gauss();
	if (result.length > 0 && result[0]!.length === 1) {
		const res: LinVector = new Array(result.length);
		// Convert Nx1 matrices to simple javascript arrays
		for (let i = 0; i < result.length; i++) res[i] = result[i]![0]!;
		return res;
	}
	return result;
}

function identity(n: number) {
	let id = new Array(n);
	for (let i = 0; i < n; i++) {
		id[i] = new Array(n);
		for (let j = 0; j < n; j++) {
			id[i][j] = i === j ? 1 : 0;
		}
	}
	return id;
}

/**
 * invert a matrix
 */
export function invert(A: LinMatrix) {
	return new Mat(A, identity(A.length)).gauss();
}
