<script>
	import { run } from '$lib/algo';

	/** @type {import('./$types').PageData} */
	export let data;

	/** @type {import('$lib/lib').Segment[]} */
	const segments = data.segments;
	const minX = Math.min(...segments.map((s) => s.xmin));
	const maxX = Math.max(...segments.map((s) => s.xmax));
	const minY = Math.min(...segments.map((s) => s.ymin));
	const maxY = Math.max(...segments.map((s) => s.ymax));
	const pad = Math.max((maxX - minX) / 50, (maxY - minY) / 50);

	let currentSegments = segments.slice();
	let result = 0;
	let done = false;

	const runIterations = async () => {
		const iterator = run(currentSegments);
		let itRes;

		while ((itRes = iterator.next())) {
			if (itRes.done) break;

			result = itRes.value.result;
			currentSegments = itRes.value.segments;

			await new Promise((res) => {
				setTimeout(res, 150);
			});
		}

		done = true;
	};

	runIterations();
</script>

<div class="root">
	<svg
		class="canvas"
		viewBox={`${minX - pad} ${minY - pad} ${maxX - minX + 2 * pad} ${maxY - minY + 2 * pad}`}
	>
		{#each currentSegments as s}
			<line
				x1={s.xmin}
				x2={s.xmax}
				y1={s.ymin}
				y2={s.ymax}
				vector-effect="non-scaling-stroke"
				stroke={s.d === 'n' ? '#099' : s.d === 's' ? '#909' : s.d === 'e' ? '#990' : '#999'}
				data-d={s.d}
			/>
		{/each}
	</svg>

	<div class="result">
		Result: {result}
		{#if done}
			<div>Done.</div>
		{:else}<div>Segments: {currentSegments.length}</div>
		{/if}
	</div>
</div>

<style>
	:global(html) {
		height: 100%;
		overflow: hidden;
	}

	.root {
		width: 100dvw;
		height: 100dvh;
		position: relative;
	}

	.canvas {
		width: 100%;
		height: 100%;
		background: #eee;
	}

	.canvas line {
		stroke-width: 1px;
	}

	.result {
		position: absolute;
		top: 20px;
		left: 20px;
		padding: 20px;
		background: rgba(128, 11, 11, 0.3);
		font-family: monospace;
		font-size: 20px;
	}
</style>
