import type { User } from '$lib/services/Location'
import { api } from './apiClient'

interface GetParticipantsResponse {
	participants: User[]
}

export async function getParticipants(id: string) {
	const result = await api.get(`events/${id}/participants`).json<GetParticipantsResponse>()

	return result
}
