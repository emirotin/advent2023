import { data } from '$lib/demo.data';
import { getData } from '$lib/lib';

export function GET() {
	return new Response(JSON.stringify(getData(data)));
}
