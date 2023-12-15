export const hash = (s: string) => {
	let v = 0;
	for (const n of s.split("").map((c) => c.charCodeAt(0))) {
		v = ((v + n) * 17) % 256;
	}
	return v;
};
