import type { Graph } from '$lib/services/graph/schemas'
import { api } from './apiClient'

type GetEventGraphResponse = Graph

export async function GetEventGraph(id: string) {
	const result = await api.get(`events/${id}/graph`).json<GetEventGraphResponse>()

	return result
}
