import type { Edge } from '$lib/services/graph/schemas'
import { api } from './apiClient'

interface GetEdgesResponse {
	edges: Edge[]
}

export async function getEdges(id: string) {
	const result = await api.get(`events/${id}/edges`).json<GetEdgesResponse>()

	return result
}
