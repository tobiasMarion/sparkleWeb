import { getEventById } from '$lib/http/getEventById.js'
import { GetEventGraph } from '$lib/http/getEventGraph.js'
import { error } from '@sveltejs/kit'

export async function load({ params }) {
	const { eventId } = params

	const [{ event }, graph] = await Promise.all([getEventById(eventId), GetEventGraph(eventId)])

	if (!event) {
		error(404)
	}

	return { event, graph }
}
