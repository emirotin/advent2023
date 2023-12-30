<script lang="ts">
	import type { PageData } from './$types';
	import { type PathInfo } from '$lib/lib';

	export let data: PageData;
	const mapData: PathInfo = data.data;
</script>

<div class="root">
	<div class="map">
		<div class="mapUnit border border-3 border-secondary">
			{#each mapData.map as row}
				<div class="mapRow">
					{#each row as cell}
						<div
							class="mapCell
						{cell === '#' ? 'background-danger' : ''}"
						>
							{cell}
						</div>
					{/each}
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.root {
		padding: 20px;
	}
	.map {
		display: flex;
	}
	.mapUnit {
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
	.mapCell {
		display: flex;
		flex-grow: 0;
		flex-shrink: 0;
		width: 20px;
		height: 20px;
		justify-content: center;
		align-items: center;
		flex-wrap: initial;
	}
</style>
