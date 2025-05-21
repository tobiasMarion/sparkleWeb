<script lang="ts">
	import { type NodePosition, type Vector } from '$lib/services/graph/schemas'
	import { vectorToArray } from '$lib/services/graph/utils'
	import { previewUpdaters, type EffectTypeMap } from '$lib/services/messages/effects'
	import type { MessageMap } from '$lib/services/messages/schemas'
	import { addListener, removeListener } from '$lib/services/messages/ws'
	import { T } from '@threlte/core'
	import { FakeGlowMaterial } from '@threlte/extras'
	import { onMount } from 'svelte'
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

	let isActive = $state(false)
	function setState(s: boolean) {
		isActive = s
	}

	const cylinderGeometry = new THREE.CylinderGeometry(radius, radius, height, 16)
	const edgeGeometry = new THREE.EdgesGeometry(cylinderGeometry)

	onMount(() => {
		function listenToEffect({ effect }: MessageMap['EFFECT']) {
			if (!particle) return

			if (effect.name === 'PULSE') {
				const handler = previewUpdaters['PULSE']
				handler(effect, particle, setState)
			}
		}

		addListener('EFFECT', listenToEffect)

		return () => {
			removeListener('EFFECT', listenToEffect)
		}
	})
</script>

{#if showLocationAreas}
	<T.LineSegments position={vectorToArray(position)} geometry={edgeGeometry}>
		<T.LineBasicMaterial color="white" />
	</T.LineSegments>
{/if}

{#if particle}
	<T.Mesh position={vectorToArray(particle.simulated.absolute)} scale={0.25}>
		<T.SphereGeometry />
		<FakeGlowMaterial glowColor={isActive ? 'red' : 'blue'} />
	</T.Mesh>
{/if}

{#if showReportedLocations}
	<T.Mesh position={vectorToArray(position)} scale={0.25}>
		<T.SphereGeometry />
		<FakeGlowMaterial glowColor="red" />
	</T.Mesh>
{/if}
