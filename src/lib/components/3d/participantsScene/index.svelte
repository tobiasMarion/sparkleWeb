<script lang="ts">
	import { getEdgeId } from '$lib/services/graph/utils'
	import type { MessageMap } from '$lib/services/messages/schemas'
	import { addListener, removeListener } from '$lib/services/messages/ws'
	import { Canvas, T } from '@threlte/core'
	import { MeshLineGeometry, MeshLineMaterial, OrbitControls } from '@threlte/extras'
	import { onMount } from 'svelte'
	import { SvelteMap } from 'svelte/reactivity'
	import LocationCylinder from '../locationCylinder.svelte'
	import {
		createCylinders,
		createInitialGraphStates,
		createLines,
		createParticles,
		type Props
	} from './scripts'

	let {
		graph,
		baseLocation,
		showLocationAreas,
		showGraphEdges,
		showReportedLocations,
		showXYZReference
	}: Props = $props()

	const initialStates = createInitialGraphStates(graph)

	let nodes = new SvelteMap(initialStates.nodes)
	let edges = new SvelteMap(initialStates.edges)

	let cylinders = $derived.by(() => createCylinders(nodes, baseLocation))
	let particles = $derived.by(() => createParticles(nodes))
	let lines = $derived.by(() => createLines(edges, particles))

	onMount(() => {
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
