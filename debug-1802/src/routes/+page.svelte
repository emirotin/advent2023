<script>
	/** @type {import('./$types').PageData} */
	export let data;

	/** @type {import('$lib/lib').Segment[]} */
	const segments = data.segments;
	const minX = Math.min(...segments.map((s) => s.xmin));
	const maxX = Math.max(...segments.map((s) => s.xmax));
	const minY = Math.min(...segments.map((s) => s.ymin));
	const maxY = Math.max(...segments.map((s) => s.ymax));
	const pad = Math.max((maxX - minX) / 50, (maxY - minY) / 50);
</script>

<div class="root">
	<svg
		class="canvas"
		viewBox={`${minX - pad} ${minY - pad} ${maxX - minX + 2 * pad} ${maxY - minY + 2 * pad}`}
	>
		{#each segments as s}
			<line x1={s.xmin} x2={s.xmax} y1={s.ymin} y2={s.ymax} vector-effect="non-scaling-stroke" />
		{/each}
	</svg>
</div>

<style>
	:global(html) {
		height: 100%;
		overflow: hidden;
	}

	.root {
		width: 100dvw;
		height: 100dvh;
	}

	.canvas {
		width: 100%;
		height: 100%;
		background: #eee;
	}

	.canvas line {
		stroke: #999;
		stroke-width: 3px;
	}
</style>
