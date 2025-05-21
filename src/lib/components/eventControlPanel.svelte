<script lang="ts">
	import type { Effect, EffectTypes } from '$lib/services/messages/effects'
	import { sendMessage } from '$lib/services/messages/ws'
	import { ArrowRightFromLine, CircleArrowOutUpRight } from '@lucide/svelte'
	import { H3, H4, Muted, Small } from './typo'
	import EffectButton from './ui/effectButton.svelte'
	import Switch from './ui/switch.svelte'

	interface Props {
		showLocationAreas: boolean
		showGraphEdges: boolean
		showReportedLocations: boolean
		showXYZReference: boolean
	}

	let {
		showLocationAreas = $bindable(false),
		showGraphEdges = $bindable(false),
		showReportedLocations = $bindable(false),
		showXYZReference = $bindable(false)
	}: Props = $props()

	function sendEffect(effect: EffectTypes) {
		let effectConfig: Effect

		switch (effect) {
			case 'PULSE':
				effectConfig = {
					name: 'PULSE',
					coordinateType: 'ABSOLUTE',
					activeTime: 500,
					spreadDelayPerUnit: 75
				}
				break

			case 'WAVE':
				effectConfig = {
					name: 'WAVE',
					direction: 'X',
					activeTime: 300,
					spreadDelayPerUnit: 10
				}
				break
		}

		sendMessage({
			type: 'EFFECT',
			effect: effectConfig
		})
	}
</script>

<div class="border border-border rounded-lg shadow round p-8 h-fit min-w-sm space-y-6">
	<div>
		<H3>Control Panel</H3>
		<Muted><Small>Send effetcs to your fireflyes</Small></Muted>
	</div>

	<div class="space-y-2">
		<H4>Effects</H4>

		<div class="grid grid-cols-3 gap-4">
			<EffectButton onclick={() => sendEffect('PULSE')}>
				<CircleArrowOutUpRight class="size-12" />
			</EffectButton>

			<EffectButton onclick={() => sendEffect('WAVE')}>
				<ArrowRightFromLine class="size-12" />
			</EffectButton>
			<EffectButton>a</EffectButton>
			<EffectButton>a</EffectButton>
			<EffectButton>a</EffectButton>
			<EffectButton>a</EffectButton>
		</div>
	</div>

	<div class="space-y-2">
		<H4>Settings</H4>
		<span class="border-b block border-zinc-800"></span>
		<div class="flex gap-2 items-center">
			<Switch id="show-axis-helper" small bind:checked={showXYZReference} />
			<label for="show-axis-helper" class="cursor-pointer ml-1 text-sm">Show axis helpers</label>
		</div>
		<div class="flex gap-2 items-center">
			<Switch id="show-reported-locations" small bind:checked={showReportedLocations} />
			<label for="show-reported-locations" class="cursor-pointer ml-1 text-sm"
				>Show Reported Locations</label
			>
		</div>
		<div class="flex gap-2 items-center">
			<Switch id="show-graph-edges" small bind:checked={showGraphEdges} />
			<label for="show-graph-edges" class="cursor-pointer ml-1 text-sm">Show Graph Edges</label>
		</div>
		<div class="flex gap-2 items-center">
			<Switch id="show-location-areas" small bind:checked={showLocationAreas} />
			<label for="show-location-areas" class="cursor-pointer ml-1 text-sm"
				>Show Location Areas</label
			>
		</div>
	</div>
</div>
