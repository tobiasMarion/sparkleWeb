<script lang="ts">
	import { type NodePosition, type Vector } from '$lib/services/graph/schemas'
	import { vectorToArray } from '$lib/services/graph/utils'
	import {
		previewUpdaters,
		type EffectTypeMap,
		type UpdatePreviewOnEffect
	} from '$lib/services/messages/effects'
	import type { MessageMap } from '$lib/services/messages/schemas'
	import { addListener, removeListener } from '$lib/services/messages/ws'
	import { T } from '@threlte/core'
	import { FakeGlowMaterial } from '@threlte/extras'
	import { onMount } from 'svelte'
	import * as THREE from 'three'
	import { Break } from 'three/tsl'

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
	let particleColor = $derived(isActive ? 'white' : '#3f3f46')

	function setState(s: boolean) {
		isActive = s
	}

	const cylinderGeometry = new THREE.CylinderGeometry(radius, radius, height, 16)
	const edgeGeometry = new THREE.EdgesGeometry(cylinderGeometry)

	onMount(() => {
		function listenToEffect({ effect }: MessageMap['EFFECT']) {
			if (!particle) return

			switch (effect.name) {
				case 'PULSE':
					previewUpdaters['PULSE'](effect, particle, setState)
					break

				case 'WAVE':
					previewUpdaters['WAVE'](effect, particle, setState)
					break

				case 'ROTATE':
					previewUpdaters['ROTATE'](effect, particle, setState)
					break
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
	<T.Mesh position={vectorToArray(particle.simulated.absolute)} scale={isActive ? 0.4 : 0.25}>
		<T.SphereGeometry />
		<FakeGlowMaterial glowColor={showReportedLocations ? 'blue' : particleColor} />
	</T.Mesh>
{/if}

{#if showReportedLocations}
	<T.Mesh position={vectorToArray(position)} scale={0.25}>
		<T.SphereGeometry />
		<FakeGlowMaterial glowColor="red" />
	</T.Mesh>
{/if}
