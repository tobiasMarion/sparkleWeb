import type { Graph, Node, NodeMetadata } from '$lib/services/graph/schemas'
import { getEdgeId, vectorToThreeVector3, type NotWeightedEdge } from '$lib/services/graph/utils'
import type { ExactLocation } from '$lib/services/location/schemas'
import { displacementOnEarth } from '$lib/services/location/utils'
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
		graph.edges.map(({ from, to }) => {
			return [getEdgeId({ from, to }), { from, to }]
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
	edges: SvelteMap<string, NotWeightedEdge>,
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
