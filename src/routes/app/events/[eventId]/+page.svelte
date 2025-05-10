<script lang="ts">
	import ParticipantsScene from '$lib/components/3d/participantsScene.svelte'
	import EventControlPanel from '$lib/components/eventControlPanel.svelte'
	import { H2, Muted } from '$lib/components/typo/'
	import type { MessageMap } from '$lib/services/Location/schemas.js'
	import {
		addListener,
		connectWebSocket,
		disconnect,
		removeListener
	} from '$lib/services/Location/ws.js'
	import { onMount } from 'svelte'

	let { data } = $props()
	let { event, participants } = data

	let participantsMap = $state(
		new Map(participants.map(({ deviceId, location }) => [deviceId, location]))
	)

	function onLocationUpdate(
		message: MessageMap['USER_JOINED'] | MessageMap['LOCATION_UPDATE_REPORT']
	) {
		console.log(message)
		const { deviceId, location } = message
		const newMap = new Map(participantsMap)
		newMap.set(deviceId, location)
		participantsMap = newMap
	}

	function onUserLeft(message: MessageMap['USER_LEFT']) {
		const newMap = new Map(participantsMap)
		newMap.delete(message.deviceId)
		participantsMap = newMap
	}

	onMount(() => {
		connectWebSocket(event.id)

		addListener('USER_JOINED', onLocationUpdate)
		addListener('LOCATION_UPDATE_REPORT', onLocationUpdate)
		addListener('USER_LEFT', onUserLeft)

		return () => {
			removeListener('USER_JOINED', onLocationUpdate)
			removeListener('LOCATION_UPDATE_REPORT', onLocationUpdate)
			removeListener('USER_LEFT', onUserLeft)

			disconnect()
		}
	})

	let showLocationAreas = $state(false)
	let showGraphEdges = $state(false)
</script>

<div class="w-full">
	<div>
		<H2>{event.name}</H2>
		<Muted>LAT {event.latitude.toPrecision(8)} LON {event.longitude.toPrecision(8)}</Muted>
	</div>

	<div class="flex gap-8">
		<div class="w-full">
			<ParticipantsScene
				participants={participantsMap}
				baseLocation={{ ...event }}
				{showLocationAreas}
				{showGraphEdges}
			/>
		</div>
		<EventControlPanel bind:showLocationAreas bind:showGraphEdges />
	</div>
</div>
