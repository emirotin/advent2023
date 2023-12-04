export const parseNums = (line: string) =>
	line.split(/\s+/).map((n) => parseInt(n));

export const parseLine = (line: string) => {
	const [_, nums] = line.split(": ");
	return nums!.trim().split(" | ").map(parseNums);
};
