import { PUBLIC_BACKEND_DOMAIN } from '$env/static/public'
import ky from 'ky'

export const api = ky.create({
	prefixUrl: 'http://' + PUBLIC_BACKEND_DOMAIN,
	hooks: {
		beforeRequest: [
			async (request) => {
				let token

				try {
					const { getRequestEvent } = await import('$app/server')
					const event = getRequestEvent()
					token = event?.cookies.get('token')
				} catch (error) {
					console.error('Error trying to get token on server:', error)
				}


				if (token) {
					request.headers.set('Authorization', `Bearer ${token}`)
				}
			}
		]
	}
})
