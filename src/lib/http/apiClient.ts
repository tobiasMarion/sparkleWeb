// src/lib/api.ts
import ky from 'ky';
import { PUBLIC_BACKEND_DOMAIN } from '$env/static/public';
import { browser } from '$app/environment';

export const api = ky.create({
	prefixUrl: 'http://' + PUBLIC_BACKEND_DOMAIN,
	hooks: {
		beforeRequest: [
			async (request) => {
				let token;

				if (!browser) {
					try {
						const { getRequestEvent } = await import('$app/server');
						const event = getRequestEvent();
						token = event?.cookies.get('token');
					} catch (error) {
						console.error('Error trying to get token on server:', error);
					}
				} else {
					console.log(document.cookie)
					token = getCookieFromBrowser('token');
				}

				if (token) {
					request.headers.set('Authorization', `Bearer ${token}`);
				}
			}
		]
	}
});

function getCookieFromBrowser(name: string): string | undefined {
	if (!browser || typeof document === 'undefined') {
		return undefined;
	}

	const cookieString = document.cookie;
	if (!cookieString) {
		return undefined;
	}

	const value = `; ${cookieString}`;
	const parts = value.split(`; ${name}=`);

	if (parts.length !== 2) {
		return undefined;
	}

	const cookiePart = parts.pop();
	if (!cookiePart) {
		return undefined;
	}

	return cookiePart.split(';')[0];
}
