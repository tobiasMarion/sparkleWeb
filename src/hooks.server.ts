import type { Handle } from '@sveltejs/kit';
import type { HandleFetch } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('token');

	event.locals.user = token ? { token } : null;

	return resolve(event);
};

export const handleFetch: HandleFetch = async ({ event, request, fetch }) => {
	const token = event.cookies.get('token');

	if (token) {
		request.headers.set('Authorization', `Bearer ${token}`);
	}

	return fetch(request);
};
