import { createEvent } from '$lib/http/createEvent'
import { fail, redirect } from '@sveltejs/kit'
import { z } from 'zod'

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData()
		const rawData = Object.fromEntries(formData)

		const createEventSchema = z.object({
			name: z.string(),
			type: z.union([z.literal('TORCH'), z.literal('SCREEN')]),
			latitude: z.coerce.number().min(-90).max(90),
			longitude: z.coerce.number().min(-180).max(180)
		})

		const { data, error } = createEventSchema.safeParse(rawData)

		if (error) {
			console.log(error)
			const errorMessages = error.errors
				.map((err) => `${err.path.join('.')} - ${err.message}`)
				.join(', ')

			return fail(422, {
				error: errorMessages
			})
		}

		const { eventId } = await createEvent(data)

		throw redirect(303, `./${eventId}`)
	}
}
