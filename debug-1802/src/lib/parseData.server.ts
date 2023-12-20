import { parseInstr, stepsToSegments } from './lib';
import { readLines } from './lib.server';

export const getSegments = () => {
	let steps = readLines(import.meta.url, 'input.txt')
		.map((l) => l.trim())
		.filter(Boolean)
		.map(parseInstr({ newMode: false }));

	return stepsToSegments(steps);
};
