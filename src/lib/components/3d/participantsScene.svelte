<script lang="ts">
	import type { Graph } from '$lib/services/graph/schemas'
	import { getEdgeId, vectorToThreeVector3 } from '$lib/services/graph/utils'
	import type { ExactLocation } from '$lib/services/location/schemas'
	import { displacementOnEarth } from '$lib/services/location/utils'
	import { addListener, removeListener } from '$lib/services/location/ws'
	import type { MessageMap } from '$lib/services/messages/schemas'
	import { Canvas, T } from '@threlte/core'
	import { MeshLineGeometry, MeshLineMaterial, OrbitControls } from '@threlte/extras'
	import { onMount } from 'svelte'
	import { SvelteMap } from 'svelte/reactivity'
	import type { Vector3 } from 'three'
	import LocationCylinder from './locationCylinder.svelte'

	interface Props {
		graph: Graph
		baseLocation: ExactLocation
		showLocationAreas: boolean
		showReportedLocations: boolean
		showGraphEdges: boolean
		showXYZReference: boolean
	}

	let {
		graph,
		baseLocation,
		showLocationAreas,
		showGraphEdges,
		showReportedLocations,
		showXYZReference
	}: Props = $props()

	let nodes = new SvelteMap(Object.entries(graph.nodes))
	let edges = new SvelteMap(
		graph.edges.map(({ from, to }) => {
			return [getEdgeId({ from, to }), { from, to }]
		})
	)

	let cylinders = $derived(
		new Map(
			Array.from(nodes.entries()).map(([node, { location }]) => {
				const { horizontalAccuracy: radius, altitude: y, verticalAccuracy } = location
				const height = verticalAccuracy * 2

				const { deltaEast: x, deltaNorth: z } = displacementOnEarth(location, baseLocation)

				const position = { x, y, z }

				return [node, { position, radius, height }]
			})
		)
	)

	let particles = $derived(
		new Map(
			Array.from(nodes.entries()).map(([node, { position }]) => {
				return [node, position]
			})
		)
	)

	let lines = $derived.by(() => {
		const map = new Map<string, Vector3[]>()

		edges.forEach(({ from, to }) => {
			const id = getEdgeId({ from, to })

			const v1 = particles.get(from)?.simulated.absolute
			const v2 = particles.get(to)?.simulated.absolute

			if (!v1 || !v2) return

			map.set(id, [vectorToThreeVector3(v1), vectorToThreeVector3(v2)])
		})

		return map
	})

	let data = $derived.by(() => {
		const comparisons = Array.from(nodes.values())
			.map(({ position }) => {
				if (!position) return

				const { uncorrected, simulated } = position
				const { x: uncorrectedX, y: uncorrectedY, z: uncorrectedZ } = uncorrected.relative
				const { x: simulatedX, y: simulatedY, z: simulatedZ } = simulated.relative

				console.log(uncorrected.relative, simulated.relative)

				return (
					uncorrectedX === simulatedX && uncorrectedY === simulatedY && uncorrectedZ === simulatedZ
				)
			})
			.filter((v) => v !== undefined)

		const total = comparisons.length
		const falses = comparisons.filter((v) => v === false).length

		const percentFalse = total > 0 ? (falses / total) * 100 : 0

		return `${falses} / ${total} = ${percentFalse.toFixed(2)}%`
	})

	function onUserJoined({ deviceId, location }: MessageMap['USER_JOINED']) {
		nodes.set(deviceId, { location, position: undefined })
	}

	function onUserLeft({ deviceId }: MessageMap['USER_LEFT']) {
		nodes.delete(deviceId)
	}

	function onSetPointReport({ deviceId, position }: MessageMap['SET_POINT_REPORT']) {
		const node = nodes.get(deviceId)

		if (!node) return
		nodes.set(deviceId, { ...node, position })
	}

	function onDistanceReport({ from, to, distance }: MessageMap['DISTANCE_REPORT']) {
		const edgeId = getEdgeId({ from, to })
		if (distance === null) {
			edges.delete(edgeId)
			return
		}

		edges.set(edgeId, { from, to })
	}

	onMount(() => {
		addListener('USER_JOINED', onUserJoined)
		addListener('USER_LEFT', onUserLeft)
		addListener('DISTANCE_REPORT', onDistanceReport)
		addListener('SET_POINT_REPORT', onSetPointReport)

		return () => {
			removeListener('USER_JOINED', onUserJoined)
			removeListener('USER_LEFT', onUserLeft)
			removeListener('SET_POINT_REPORT', onSetPointReport)
			removeListener('DISTANCE_REPORT', onDistanceReport)
		}
	})
</script>

<div class="aspect-video">
	{data}
	<Canvas>
		<T.PerspectiveCamera makeDefault position={[5, 5, 5]}>
			<OrbitControls />
		</T.PerspectiveCamera>

		{#if showXYZReference}
			<T.GridHelper args={[100, 10]} />
			<T.AxesHelper args={[1, 1, 1]} />
		{/if}

		{#each nodes as [id] (id)}
			<LocationCylinder
				particle={particles.get(id)!}
				cylinder={cylinders.get(id)!}
				{showLocationAreas}
				{showReportedLocations}
			/>
		{/each}

		{#if showGraphEdges}
			{#each lines as [id, line] (id)}
				<T.Mesh>
					<MeshLineGeometry points={line} />
					<MeshLineMaterial width={0.05} color="#27272a" />
				</T.Mesh>
			{/each}
		{/if}
	</Canvas>
</div>
