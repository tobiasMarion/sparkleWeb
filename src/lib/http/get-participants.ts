import type { Participant } from '$lib/services/location/schemas'
import { api } from './apiClient'

interface GetParticipantsResponse {
	participants: Participant[]
}

export async function getParticipants(id: string) {
	const result = await api.get(`events/${id}/participants`).json<GetParticipantsResponse>()

	return result
}
