import type { Edge, Graph, Node, NodeMetadata } from '$lib/services/graph/schemas'
import { getEdgeId, vectorToThreeVector3 } from '$lib/services/graph/utils'
import type { ExactLocation } from '$lib/services/location/schemas'
import { displacementOnEarth } from '$lib/services/location/utils'
import type { MessageMap } from '$lib/services/messages/schemas'
import type { SvelteMap } from 'svelte/reactivity'
import type { Vector3 } from 'three'

export interface Props {
	graph: Graph
	baseLocation: ExactLocation
	showLocationAreas: boolean
	showReportedLocations: boolean
	showGraphEdges: boolean
	showXYZReference: boolean
}

export function createInitialGraphStates(graph: Graph) {
	const nodes = Object.entries(graph.nodes)

	const edges = new Map(
		graph.edges.map(({ from, to, value }) => {
			return [getEdgeId({ from, to }), { from, to, value }]
		})
	)

	return { nodes, edges }
}

export function createCylinders(nodes: SvelteMap<Node, NodeMetadata>, baseLocation: ExactLocation) {
	return new Map(
		Array.from(nodes.entries()).map(([node, { location }]) => {
			const { horizontalAccuracy: radius, altitude: y, verticalAccuracy } = location
			const height = verticalAccuracy * 2

			const { deltaEast: x, deltaNorth: z } = displacementOnEarth(location, baseLocation)

			const position = { x, y, z }

			return [node, { position, radius, height }]
		})
	)
}

export function createParticles(nodes: SvelteMap<Node, NodeMetadata>) {
	return new Map(
		Array.from(nodes.entries()).map(([node, { position }]) => {
			return [node, position]
		})
	)
}

export function createLines(
	edges: SvelteMap<string, Edge>,
	particles: ReturnType<typeof createParticles>
) {
	const map = new Map<string, Vector3[]>()

	edges.forEach(({ from, to }) => {
		const id = getEdgeId({ from, to })

		const v1 = particles.get(from)
		const v2 = particles.get(to)

		if (!v1 || !v2) return

		map.set(id, [
			vectorToThreeVector3(v1.simulated.absolute),
			vectorToThreeVector3(v2.simulated.absolute)
		])
	})

	return map
}

export function createGraphListeners(
	nodes: SvelteMap<Node, NodeMetadata>,
	edges: SvelteMap<string, Edge>
) {
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

		edges.set(edgeId, { from, to, value: distance })
	}

	return { onUserJoined, onUserLeft, onSetPointReport, onDistanceReport }
}
