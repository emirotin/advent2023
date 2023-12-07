const strictCeil = (n: number) => (n === ~~n ? n + 1 : Math.ceil(n));
const strictFloor = (n: number) => (n === ~~n ? n - 1 : Math.floor(n));

export const getGoodInterval = (t: number, d: number) => {
	const D_sqrt = Math.sqrt(t * t - 4 * d);
	let c1 = Math.max(0, strictCeil((t - D_sqrt) / 2));
	let c2 = Math.min(t, strictFloor((t + D_sqrt) / 2));

	return c2 - c1 + 1;
};
