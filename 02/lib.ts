export interface Draw {
	red: number;
	green: number;
	blue: number;
}

export const LIMITS = {
	red: 12,
	green: 13,
	blue: 14,
} as const satisfies Draw;

export const parseDraw = (draw: string) => {
	const partsLine = draw.split(", ");

	const parts = partsLine.map((part) => {
		const [count, color] = part.split(" ");

		if (!color || !count || !Object.keys(LIMITS).includes(color))
			throw new Error(`Malformed: ${part}`);

		return {
			color,
			count: parseInt(count),
		};
	});

	return parts.reduce<Draw>(
		(acc, part) => {
			acc[part.color as keyof Draw] = part.count;
			return acc;
		},
		{ red: 0, green: 0, blue: 0 }
	);
};

export const parseLine = (line: string) => {
	const [game, drawsLine] = line.split(": ");

	if (!game || !drawsLine) throw new Error(`Malformed: ${line}`);

	const idMatch = game.match(/Game (\d+)/);
	if (!idMatch?.[1]) throw new Error(`Malformed: ${line}`);

	const draws = drawsLine.split("; ").map(parseDraw);

	return {
		id: parseInt(idMatch[1]),
		draws,
	};
};
