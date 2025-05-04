import { signInWithGitHub } from '$lib/http/signInWithGitHub.js';
import { json, redirect } from '@sveltejs/kit';

export async function GET({ request, cookies }) {
	const url = new URL(request.url);

	const code = url.searchParams.get('code');

	if (!code) {
		return json({ message: 'Github OAuth code was not found.' }, { status: 400 });
	}

	const { token } = await signInWithGitHub({ code });

	if (!token) {
		return json({ message: 'We could not validate your code.' }, { status: 500 });
	}

	cookies.set('token', token, {
		path: '/',
		maxAge: 60 * 60 * 24 * 7,
		httpOnly: false
	});

	throw redirect(303, '/app');
}
