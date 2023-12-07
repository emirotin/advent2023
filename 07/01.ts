import { readLines, sum } from "../lib/index.js";

const cardToValue = {
	2: 2,
	3: 3,
	4: 4,
	5: 5,
	6: 6,
	7: 7,
	8: 8,
	9: 9,
	T: 10,
	J: 11,
	Q: 12,
	K: 13,
	A: 14,
} as const;

const lines = readLines(import.meta.url, "input.txt")
	.map((l) => l.trim())
	.filter(Boolean);

const parseLine = (line: string) => {
	const [cards, bet] = line.split(" ");
	return {
		cards: cards!
			.split("")
			.map((c) => cardToValue[c as keyof typeof cardToValue]!),
		cardsLine: cards!,
		bet: parseInt(bet!),
	};
};

const rankLine = (ns: number[]) => {
	const countsByCard = ns.reduce<Record<number, number>>((acc, n) => {
		acc[n] = (acc[n] ?? 0) + 1;
		return acc;
	}, {});

	const counts = Object.values(countsByCard);

	if (counts.length === 1) return 7;
	if (counts.length === 2 && counts.includes(4)) return 6;
	if (counts.length === 2 && counts.includes(3) && counts.includes(2)) return 5;
	if (counts.includes(3)) return 4;
	if (counts.filter((c) => c === 2).length === 2) return 3;
	if (counts.includes(2)) return 2;
	return 1;
};

const bets = lines.map(parseLine);

const cmpArrays = (a: number[], b: number[]) => {
	let i = 0;
	while (i < a.length && i < b.length) {
		if (a[i] !== b[i]) return a[i]! - b[i]!;
		i++;
	}
	return 0;
};

const rankedBets = bets
	.map(({ cards, bet, cardsLine }) => ({
		ns: [rankLine(cards), ...cards],
		cardsLine,
		bet,
	}))
	.sort((rb1, rb2) => cmpArrays(rb1.ns, rb2.ns));

console.log(sum(rankedBets.map((bet, i) => (i + 1) * bet.bet)));
