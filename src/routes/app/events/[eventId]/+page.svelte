<script lang="ts">
	import ParticipantsScene from '$lib/components/3d/participantsScene.svelte'
	import EventControlPanel from '$lib/components/eventControlPanel.svelte'
	import { H2, Muted } from '$lib/components/typo/'
	import { connectWebSocket, disconnect } from '$lib/services/location/ws.js'
	import { onMount } from 'svelte'

	let { data } = $props()
	let { event, graph } = data

	let showLocationAreas = $state(false)
	let showGraphEdges = $state(false)

	onMount(() => {
		connectWebSocket(event.id)

		return () => {
			disconnect()
		}
	})
</script>

<div class="w-full">
	<div>
		<H2>{event.name}</H2>
		<Muted>LAT {event.latitude.toPrecision(8)} LON {event.longitude.toPrecision(8)}</Muted>
	</div>

	<div class="flex gap-8">
		<div class="w-full">
			<ParticipantsScene baseLocation={{ ...event }} {graph} {showLocationAreas} {showGraphEdges} />
		</div>
		<EventControlPanel bind:showLocationAreas bind:showGraphEdges />
	</div>
</div>
