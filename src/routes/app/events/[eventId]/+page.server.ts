import { getEventById } from '$lib/http/getEventById.js'
import { getParticipants } from '$lib/http/getParticipants.js'
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
