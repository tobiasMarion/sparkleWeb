import type { Edge, Node, NodeMetadata } from '$lib/services/graph/schemas'
import type { SvelteMap } from 'svelte/reactivity'

function generateNodeLocations(nodes: SvelteMap<Node, NodeMetadata>) {
	const header = [
		'id',
		'latitude',
		'longitude',
		'horizontalAccuracy',
		'altitude',
		'verticalAccuracy'
	]

	const rows = [header.join(',')]

	nodes.entries().forEach(([_, { location }], index) => {
		const row = [
			index,
			location.latitude,
			location.longitude,
			location.horizontalAccuracy,
			location.altitude,
			location.verticalAccuracy
		]
		rows.push(row.join(','))
	})

	return rows.join('\n')
}

function generateNodePositions(nodes: SvelteMap<Node, NodeMetadata>) {
	const header = [
		'id',

		'uncorrected.absolute.x',
		'uncorrected.absolute.y',
		'uncorrected.absolute.z',

		'uncorrected.relative.x',
		'uncorrected.relative.y',
		'uncorrected.relative.z',

		'simulated.absolute.x',
		'simulated.absolute.y',
		'simulated.absolute.z',

		'simulated.relative.x',
		'simulated.relative.y',
		'simulated.relative.z'
	]

	const rows = [header.join(',')]

	nodes.entries().forEach(([_, { position }], index) => {
		const row = [
			index,

			position?.uncorrected.absolute.x ?? '',
			position?.uncorrected.absolute.y ?? '',
			position?.uncorrected.absolute.z ?? '',

			position?.uncorrected.relative.x ?? '',
			position?.uncorrected.relative.y ?? '',
			position?.uncorrected.relative.z ?? '',

			position?.simulated.absolute.x ?? '',
			position?.simulated.absolute.y ?? '',
			position?.simulated.absolute.z ?? '',

			position?.simulated.relative.x ?? '',
			position?.simulated.relative.y ?? '',
			position?.simulated.relative.z ?? ''
		]

		rows.push(row.join(','))
	})

	return rows.join('\n')
}

function generateAdjacencyMatrix({ nodes, edges }: ExportGraphReportProps): string {
	const nodesArray = [...nodes.entries()].map(([node]) => node)

	const size = nodesArray.length
	const header = ['id', ...nodesArray.map((_, i) => i)]
	const rows = [header.join(',')]

	for (let i = 0; i < size; i++) {
		const fromNode = nodesArray[i]
		const row: (string | number)[] = [i]

		for (let j = 0; j < size; j++) {
			const toNode = nodesArray[j]
			const edgeId = `${fromNode}->${toNode}`
			const value = edges.get(edgeId)?.value ?? ''
			row.push(value)
		}

		rows.push(row.join(','))
	}

	return rows.join('\n')
}

interface ExportGraphReportProps {
	nodes: SvelteMap<Node, NodeMetadata>
	edges: SvelteMap<string, Edge>
}

export function exportGraphReport({ nodes, edges }: ExportGraphReportProps) {
	const reports = [
		{ content: generateNodeLocations(nodes), filename: 'node_locations.csv' },
		{ content: generateNodePositions(nodes), filename: 'node_positions.csv' },
		{ content: generateAdjacencyMatrix({ nodes, edges }), filename: 'adjacency_matrix.csv' }
	]

	reports.forEach(({ content, filename }) => {
		const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
		const url = URL.createObjectURL(blob)

		const a = document.createElement('a')
		a.href = url
		a.download = filename
		a.style.display = 'none'

		document.body.appendChild(a)
		a.click()

		document.body.removeChild(a)
		URL.revokeObjectURL(url)
	})
}
