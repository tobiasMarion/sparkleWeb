<script lang="ts">
	import { H3, H4, Muted, Small } from './typo'
	import Switch from './ui/switch.svelte'

	let {
		showLocationAreas = $bindable(false),
		showGraphEdges = $bindable(false)
	}: { showLocationAreas: boolean; showGraphEdges: boolean } = $props()
</script>

<div class="border border-border rounded-lg shadow round p-8 h-fit min-w-sm space-y-6">
	<div>
		<H3>Control Panel</H3>
		<Muted><Small>Send effetcs to your fireflyes</Small></Muted>
	</div>

	<div class="space-y-2">
		<H4>Effects</H4>

		<div class="grid grid-cols-3 gap-4">
			<div
				class="bg-zinc-900 aspect-square rounded-2xl p-4 shadow transition cursor-pointer hover:bg-zinc-900/70"
			>
				a
			</div>
			<div
				class="bg-zinc-900 aspect-square rounded-2xl p-4 shadow transition cursor-pointer hover:bg-zinc-900/70"
			>
				a
			</div>
			<div
				class="bg-zinc-900 aspect-square rounded-2xl p-4 shadow transition cursor-pointer hover:bg-zinc-900/70"
			>
				a
			</div>
			<div
				class="bg-zinc-900 aspect-square rounded-2xl p-4 shadow transition cursor-pointer hover:bg-zinc-900/70"
			>
				a
			</div>
			<div
				class="bg-zinc-900 aspect-square rounded-2xl p-4 shadow transition cursor-pointer hover:bg-zinc-900/70"
			>
				a
			</div>
			<div
				class="bg-zinc-900 aspect-square rounded-2xl p-4 shadow transition cursor-pointer hover:bg-zinc-900/70"
			>
				a
			</div>
			<div
				class="bg-zinc-900 aspect-square rounded-2xl p-4 shadow transition cursor-pointer hover:bg-zinc-900/70"
			>
				a
			</div>
			<div
				class="bg-zinc-900 aspect-square rounded-2xl p-4 shadow transition cursor-pointer hover:bg-zinc-900/70"
			>
				a
			</div>
			<div
				class="bg-zinc-900 aspect-square rounded-2xl p-4 shadow transition cursor-pointer hover:bg-zinc-900/70"
			>
				a
			</div>
		</div>
	</div>

	<div class="space-y-2">
		<H4>Settings</H4>
		<span class="border-b block border-zinc-800"></span>
		<div class="flex gap-2 items-center">
			<Switch id="show-graph-edges" small bind:checked={showGraphEdges} />
			<label for="show-graph-edges" class="cursor-pointer ml-1">Show Graph Edges</label>
		</div>
		<div class="flex gap-2 items-center">
			<Switch id="show-location-areas" small bind:checked={showLocationAreas} />
			<label for="show-location-areas" class="cursor-pointer ml-1">Show Location Areas</label>
		</div>
	</div>
</div>
