import { getSegments } from '$lib/parseData.server';

export function GET() {
	return new Response(JSON.stringify(getSegments()));
}
