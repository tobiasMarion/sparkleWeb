<script lang="ts">
	import ParticipantsScene from '$lib/components/3d/participantsScene.svelte'
	import { H2, Muted } from '$lib/components/typo/'
	import type {
		MessageMap,
		MessageTypes,
		ReceivableMessage
	} from '$lib/services/Location/schemas.js'
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

	function onUserJoined(message: MessageMap['USER_JOINED']) {
		const { deviceId, location } = message
		participantsMap = new Map(participantsMap).set(deviceId, location)
	}

	function onLocationUpdate(message: MessageMap['LOCATION_UPDATE']) {
		const { deviceId, location } = message
		participantsMap = new Map(participantsMap).set(deviceId, location)
	}

	function onUserLeft(message: MessageMap['USER_LEFT']) {
		const newMap = new Map(participantsMap)
		newMap.delete(message.deviceId)
		participantsMap = newMap
	}

	onMount(() => {
		connectWebSocket(event.id)

		addListener('USER_JOINED', onUserJoined)
		addListener('USER_LEFT', onUserLeft)
		addListener('LOCATION_UPDATE', onLocationUpdate)

		return () => {
			removeListener('USER_JOINED', onUserJoined)
			removeListener('USER_LEFT', onUserLeft)
			removeListener('LOCATION_UPDATE', onLocationUpdate)

			disconnect()
		}
	})
</script>

<div class="w-full">
	<div>
		<H2>{event.name}</H2>
		<Muted>LAT {event.latitude.toPrecision(8)} LON {event.longitude.toPrecision(8)}</Muted>
	</div>

	<ParticipantsScene participants={participantsMap} baseLocation={{ ...event }} />
</div>
