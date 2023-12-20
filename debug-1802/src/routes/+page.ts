export async function load({ fetch }) {
	const res = await fetch('/api/data');
	const segments = await res.json();
	return {
		segments
	};
}
