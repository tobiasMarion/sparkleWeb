import { getEventById } from '$lib/http/get-event-by-id.js'
import { getParticipants } from '$lib/http/get-participants.js'
import { error } from '@sveltejs/kit'

export async function load({ params }) {
	const { eventId } = params

	const [{ event }, { participants }] = await Promise.all([
		getEventById(eventId),
		getParticipants(eventId)
	])

	if (!event) {
		error(404)
	}

	return {
		event,
		participants
	}
}
