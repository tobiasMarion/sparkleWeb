<script lang="ts">
	import SencondaryButton from '$lib/components/ui/sencondaryButton.svelte'
	import { addListener, removeListener } from '$lib/services/messages/ws'
	import { Download, View } from '@lucide/svelte'
	import { Canvas, T } from '@threlte/core'
	import { MeshLineGeometry, MeshLineMaterial, OrbitControls } from '@threlte/extras'
	import { onMount } from 'svelte'
	import { SvelteMap } from 'svelte/reactivity'
	import LocationCylinder from '../locationCylinder.svelte'
	import { exportGraphReport } from './reports'
	import {
		createCylinders,
		createGraphListeners,
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
		<SencondaryButton onclick={() => exportGraphReport({ nodes, edges })}>
			<Download class="size-4 mr-2" />
			Export Graph State
		</SencondaryButton>

		<SencondaryButton>
			<View class="size-4 mr-2" />
			Center Graph on Scene
		</SencondaryButton>
	</div>
</div>
