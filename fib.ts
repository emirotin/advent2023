const cache = new Map<number, number>();

function fib(n: number): number {
	if (cache.has(n)) return cache.get(n)!;

	if (n === 1 || n === 2) return 1;
	const result = fib(n - 1) + fib(n - 2);

	cache.set(n, result);
	return result;
}

for (let n = 1; n <= 10000; n++) {
	console.log(fib(n));
}
