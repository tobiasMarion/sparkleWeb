<script lang="ts">
	import ParticipantsScene from '$lib/components/3d/participantsScene.svelte'
	import { H2, Muted } from '$lib/components/typo/'
	import type { ReceivableMessage } from '$lib/services/Location/schemas.js'
	import { addListener, connectWebSocket, disconnect } from '$lib/services/Location/ws.js'
	import { onMount } from 'svelte'

	let { data } = $props()
	let { event, participants } = data

	onMount(() => {
		connectWebSocket(event.id)

		addListener('USER_JOINED', (message: ReceivableMessage) => {
			console.log(message)
		})

		return disconnect
	})
</script>

<div class="w-full">
	<div>
		<H2>{event.name}</H2>
		<Muted>LAT {event.latitude.toPrecision(8)} LON {event.longitude.toPrecision(8)}</Muted>
	</div>

	<ParticipantsScene
		{participants}
		baseLocation={{ latitude: event.latitude, longitude: event.longitude }}
	/>
</div>
