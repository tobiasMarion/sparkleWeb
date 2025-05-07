<script lang="ts">
	import type { ExactLocation, User } from '$lib/services/Location'
	import { displacementOnEarth } from '$lib/services/Location/utils'
	import { Canvas, T } from '@threlte/core'
	import { OrbitControls } from '@threlte/extras'
	import LocationCylinder from './locationCylinder.svelte'

	let { participants, baseLocation }: { participants: User[]; baseLocation: ExactLocation } = $props()

	let solids = $derived(
		participants.map(({ location }) => {
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
			<LocationCylinder particle={solid.position} cylinder={solid} />
		{/each}
	</Canvas>
</div>
