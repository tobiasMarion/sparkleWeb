import { api } from './apiClient'

export interface Event {
	id: string
	type: 'TORCH' | 'SCREEN'
	name: string
	status: 'OPEN' | 'CLOSED' | 'FINISHED'
	latitude: number
	longitude: number
	userId: string
	createdAt: string
	updatedAt: string
}

export interface GetEventByIdResponse {
	event: Event
}

export async function getEventById(id: string) {
	const result = await api.get(`events/${id}`).json<GetEventByIdResponse>()

	return result
}
