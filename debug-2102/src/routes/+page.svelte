<script lang="ts">
	import type { PageData } from './$types';
	import { type MapData, multiplyMap, calcPaths, sliceMap, sign } from '$lib/lib';

	export let data: PageData;
	const mapData: MapData = data.data;
	const { map: originalMap, size: originalSize, start: originalStart } = mapData;

	const MULT = 7;

	const map = multiplyMap(originalMap, MULT);
	const size = originalSize * MULT;
	const start = [
		originalStart[0] + ((MULT - 1) / 2) * originalSize,
		originalStart[1] + ((MULT - 1) / 2) * originalSize
	] as const;

	const pathInfo = calcPaths(map, size, start);

	const subMaps = sliceMap(pathInfo.map, MULT);

	let selected: {
		mr: number;
		mc: number;
		r: number;
		c: number;
	} | null = null;
</script>

<div class="root">
	<div class="map">
		{#each subMaps as subMapsRow, j}
			{@const mr = j - (MULT - 1) / 2}
			<div class="mapRow">
				{#each subMapsRow as map, i}
					{@const mc = i - (MULT - 1) / 2}
					<div
						class="mapUnit border border-3
						{mc === 0 && mr === 0 ? 'border-secondary background-primary' : 'border-primary'}"
					>
						{#each map as row, r}
							<div class="mapUnitRow">
								{#each row as cell, c}
									<!-- svelte-ignore a11y-click-events-have-key-events -->
									<!-- svelte-ignore a11y-no-static-element-interactions -->
									<div
										class="mapUnitCell
											{cell === '#' ? 'background-danger' : 'cellNumber'}
											{selected &&
										sign(mr) === sign(selected.mr) &&
										sign(mc) === sign(selected.mc) &&
										r === selected.r &&
										c === selected.c
											? 'background-success'
											: ''}
										"
										on:click={cell === '#'
											? undefined
											: () => {
													selected = { mr, mc, r, c };
												}}
									>
										{cell}
									</div>
								{/each}
							</div>
						{/each}
					</div>
				{/each}
			</div>
		{/each}
	</div>
</div>

<style>
	.root {
		padding: 20px;
	}
	.map {
		display: flex;
		flex-direction: column;
		flex-wrap: nowrap;
		width: auto;
	}
	.mapRow {
		flex-grow: 0;
		flex-shrink: 0;
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
	}
	.mapUnit {
		display: flex;
		flex-direction: column;
		flex-wrap: nowrap;
		width: auto;
	}
	.mapUnitRow {
		flex-grow: 0;
		flex-shrink: 0;
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
	}
	.mapUnitCell {
		display: flex;
		flex-grow: 0;
		flex-shrink: 0;
		width: 24px;
		height: 24px;
		justify-content: center;
		align-items: center;
		flex-wrap: initial;
		cursor: pointer;
	}
	.cellNumber {
		font-size: 0.5em;
	}
</style>
