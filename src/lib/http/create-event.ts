import { api } from './apiClient'

export interface CreateEventRequest {
	name: string
	latitude: number
	longitude: number
	type: 'TORCH' | 'SCREEN'
}

interface CreateEventResponse {
	eventId: string
}

export async function createEvent(params: CreateEventRequest) {
	const result = await api.post('events', { json: { ...params } }).json<CreateEventResponse>()

	return result
}
