<script lang="ts">
	import ParticipantsScene from '$lib/components/3d/participantsScene.svelte'
	import { H2, Muted } from '$lib/components/typo/'

	let { data } = $props()
	let { event, participants } = data
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
