import { PUBLIC_BACKEND_DOMAIN } from '$env/static/public'
import { getCookieFromBrowser } from '$lib/utils'
import ky from 'ky'

export const api = ky.create({
  prefixUrl: 'http://' + PUBLIC_BACKEND_DOMAIN,
  hooks: {
    beforeRequest: [
      async (request) => {
        const token = getCookieFromBrowser('token')

        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`)
        }
      }
    ]
  }
})
