<script lang="ts">
	import { Canvas, T } from '@threlte/core'
	import { MeshLineGeometry, MeshLineMaterial, OrbitControls } from '@threlte/extras'
	import { onMount } from 'svelte'
	import { SvelteMap } from 'svelte/reactivity'
	import { addListener, removeListener } from '$lib/services/messages/ws'
	import LocationCylinder from '../locationCylinder.svelte'
	import {
		createCylinders,
		createGraphListeners,
		createInitialGraphStates,
		createLines,
		createParticles,
		type Props
	} from './scripts'
	import Button from '$lib/components/ui/button.svelte'
	import { Download, View } from '@lucide/svelte'

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
		const listeners = createGraphListeners(nodes, edges)

		addListener('USER_JOINED', listeners.onUserJoined)
		addListener('USER_LEFT', listeners.onUserLeft)
		addListener('DISTANCE_REPORT', listeners.onDistanceReport)
		addListener('SET_POINT_REPORT', listeners.onSetPointReport)

		return () => {
			removeListener('USER_JOINED', listeners.onUserJoined)
			removeListener('USER_LEFT', listeners.onUserLeft)
			removeListener('SET_POINT_REPORT', listeners.onSetPointReport)
			removeListener('DISTANCE_REPORT', listeners.onDistanceReport)
		}
	})
</script>

<div class="aspect-video space-y-8">
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

	<div class="flex gap-4 justify-end">
		<Button
			class="bg-transparent hover:bg-tranparent text-xs text-muted-foreground border border-zinc-600 flex items-center"
		>
			<Download class="size-4 mr-2" />
			Export Graph State</Button
		>

		<Button
			class="bg-transparent hover:bg-tranparent text-xs text-muted-foreground border border-zinc-600 flex items-center"
		>
			<View class="size-4 mr-2" />
			Center Graph on Scene</Button
		>
	</div>
</div>
