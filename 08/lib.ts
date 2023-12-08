export const parseSteps = (line: string) =>
	line.split("").map((c) => (c === "R" ? 1 : 0));

export const parseTransitions = (lines: string[]) =>
	lines.map((line) => {
		const [from, tos] = line.split(" = ");
		return {
			from: from!,
			tos: tos!.replaceAll(/[()]/g, "").split(", ") as [string, string],
		};
	});
