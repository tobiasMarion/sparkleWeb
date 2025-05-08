<script lang="ts">
	import ParticipantsScene from '$lib/components/3d/participantsScene.svelte'
	import { H2, H3, Muted, Small } from '$lib/components/typo/'
	import H4 from '$lib/components/typo/h4.svelte'
	import P from '$lib/components/typo/p.svelte'
	import Switch from '$lib/components/ui/switch.svelte'
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
</script>

<div class="w-full">
	<div>
		<H2>{event.name}</H2>
		<Muted>LAT {event.latitude.toPrecision(8)} LON {event.longitude.toPrecision(8)}</Muted>
	</div>

	<div class="flex gap-8">
		<div class="w-full">
			<ParticipantsScene participants={participantsMap} baseLocation={{ ...event }} />
		</div>
		<div class="border border-border rounded-lg shadow-sm round p-8 h-fit min-w-sm space-y-6">
			<div>
				<H3>Control Panel</H3>
				<Muted><Small>Send effetcs to your fireflyes</Small></Muted>
			</div>

			<div class="space-y-2">
				<H4>Effects</H4>

				<div class="grid grid-cols-3 gap-4">
					<div class="bg-zinc-900 aspect-square rounded-2xl p-4 shadow">a</div>
					<div class="bg-zinc-900 aspect-square rounded-2xl p-4 shadow">a</div>
					<div class="bg-zinc-900 aspect-square rounded-2xl p-4 shadow">a</div>
					<div class="bg-zinc-900 aspect-square rounded-2xl p-4 shadow">a</div>
					<div class="bg-zinc-900 aspect-square rounded-2xl p-4 shadow">a</div>
					<div class="bg-zinc-900 aspect-square rounded-2xl p-4 shadow">a</div>
					<div class="bg-zinc-900 aspect-square rounded-2xl p-4 shadow">a</div>
					<div class="bg-zinc-900 aspect-square rounded-2xl p-4 shadow">a</div>
					<div class="bg-zinc-900 aspect-square rounded-2xl p-4 shadow">a</div>
				</div>
			</div>

			<div class="space-y-2">
				<H4>Settings</H4>
				<div class="flex gap-2 items-center">
					<Switch id="show-location-areas" small bind:checked={showLocationAreas} />
					<label for="show-location-areas" class="cursor-pointer ml-1">Show location spaces</label>
				</div>
			</div>
		</div>
	</div>
</div>
