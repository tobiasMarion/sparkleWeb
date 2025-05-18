<script lang="ts">
	import { type NodePosition, type Vector } from '$lib/services/graph/schemas'
	import { vectorToArray } from '$lib/services/graph/utils'
	import { T } from '@threlte/core'
	import { FakeGlowMaterial } from '@threlte/extras'
	import * as THREE from 'three'

	interface Props {
		showLocationAreas: boolean
		showReportedLocations: boolean
		cylinder: {
			position: Vector
			radius: number
			height: number
		}
		particle?: NodePosition
	}

	let { cylinder, particle, showLocationAreas, showReportedLocations }: Props = $props()
	let { radius, height, position } = cylinder

	const cylinderGeometry = new THREE.CylinderGeometry(radius, radius, height, 16)
	const edgeGeometry = new THREE.EdgesGeometry(cylinderGeometry)
</script>

{#if showLocationAreas}
	<T.LineSegments position={vectorToArray(position)} geometry={edgeGeometry}>
		<T.LineBasicMaterial color="white" />
	</T.LineSegments>
{/if}

{#if particle}
	<T.Mesh position={vectorToArray(particle.simulated.absolute)} scale={0.25}>
		<T.SphereGeometry />
		<FakeGlowMaterial glowColor="blue" />
	</T.Mesh>
{/if}

{#if showReportedLocations}
	<T.Mesh position={vectorToArray(position)} scale={0.25}>
		<T.SphereGeometry />
		<FakeGlowMaterial glowColor="red" />
	</T.Mesh>
{/if}
