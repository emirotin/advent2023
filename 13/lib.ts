export const parseMap = (map: string) => map.trim().split("\n");

export const toColumns = (map: string[]) => {
	const rows = map.length;
	const columns = map[0]!.length;

	const rowsRange = Array.from({ length: rows }, (_, i) => i);

	return Array.from({ length: columns }, (_, c) =>
		rowsRange.map((r) => map[r]!.at(c)).join("")
	);
};
