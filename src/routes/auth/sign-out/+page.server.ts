// src/routes/auth/sign-out/+page.server.ts
import { redirect } from '@sveltejs/kit'

export function load({ cookies }) {
	cookies.delete('token', { path: '/' })

	throw redirect(303, '/')
}
