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
	Q: 12,
	K: 13,
	A: 14,
	J: 0,
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
	const countsByCard = ns
		.filter((n) => n !== 0)
		.reduce<Record<number, number>>((acc, n) => {
			acc[n] = (acc[n] ?? 0) + 1;
			return acc;
		}, {});

	const jsCount = ns.filter((n) => n === 0).length;

	const counts = Object.values(countsByCard);

	// non-J cards are all the same => we can make 5 of a kind
	if (counts.length <= 1) return 7;

	// the most popular non-J card joined with Js counts 4 =>
	if (Math.max(...counts) + jsCount === 4) return 6;

	// exactly two different cards and excluding the cases above => can make full-house
	if (counts.length === 2) return 5;

	// convert J to most popular card and have 3 of them => 3 of a kind
	if (Math.max(...counts) + jsCount === 3) return 4;

	const twosCount = counts.filter((c) => c === 2).length;

	// have two pairs or one pair + at least one J => can make two pairs (or better, which is already covered)
	if (twosCount === 2 || (twosCount === 1 && jsCount >= 1)) return 3;

	// have one real pair or at least one J => can make a pair (or better, which is already covered)
	if (twosCount >= 1 || jsCount >= 1) return 2;

	return 1;
};

const cmpArrays = (a: number[], b: number[]) => {
	let i = 0;
	while (i < a.length && i < b.length) {
		if (a[i] !== b[i]) return a[i]! - b[i]!;
		i++;
	}
	return 0;
};

const bets = lines.map(parseLine);

const rankedBets = bets
	.map(({ cards, bet, cardsLine }) => ({
		ns: [rankLine(cards), ...cards],
		cardsLine,
		bet,
	}))
	.sort((rb1, rb2) => cmpArrays(rb1.ns, rb2.ns));

console.log(sum(rankedBets.map((bet, i) => (i + 1) * bet.bet)));
