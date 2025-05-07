// src/lib/api.ts
import ky from 'ky'
import { PUBLIC_BACKEND_DOMAIN } from '$env/static/public'
import { browser } from '$app/environment'
import { getCookieFromBrowser } from '$lib/utils'

export const api = ky.create({
	prefixUrl: 'http://' + PUBLIC_BACKEND_DOMAIN,
	hooks: {
		beforeRequest: [
			async (request) => {
				let token

				if (!browser) {
					try {
						const { getRequestEvent } = await import('$app/server')
						const event = getRequestEvent()
						token = event?.cookies.get('token')
					} catch (error) {
						console.error('Error trying to get token on server:', error)
					}
				} else {
					token = getCookieFromBrowser('token')
				}

				if (token) {
					request.headers.set('Authorization', `Bearer ${token}`)
				}
			}
		]
	}
})
