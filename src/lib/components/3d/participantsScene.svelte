<script lang="ts">
	import type { ExactLocation, Location, Participant } from '$lib/services/location/schemas'
	import { displacementOnEarth } from '$lib/services/location/utils'
	import { Canvas, T } from '@threlte/core'
	import { OrbitControls } from '@threlte/extras'
	import LocationCylinder from './locationCylinder.svelte'
	import Switch from '$lib/components/ui/switch.svelte'

	interface Props {
		participants: Map<string, Location>
		baseLocation: ExactLocation
		showLocationAreas: boolean
		showGraphEdges: boolean
	}

	let { participants, baseLocation, showLocationAreas }: Props = $props()

	let solids = $derived(
		participants.values().map((location) => {
			const { deltaEast, deltaNorth } = displacementOnEarth(location, baseLocation)

			return {
				position: {
					x: deltaEast,
					y: location.altitude,
					z: deltaNorth
				},
				radius: location.horizontalAccuracy,
				height: 2 * location.verticalAccuracy
			}
		})
	)
</script>

<div>
	<Canvas>
		<T.PerspectiveCamera makeDefault position={[5, 5, 5]}>
			<OrbitControls />
		</T.PerspectiveCamera>

		<T.AxesHelper args={[0.5, 0.5, 0.5]} />

		{#each solids as solid}
			<LocationCylinder particle={solid.position} cylinder={solid} {showLocationAreas} />
		{/each}
	</Canvas>
</div>
