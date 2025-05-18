import { api } from "./apiClientBrowser"

export interface User {
	id: string
	name: string
	email: string
	avatarUrl: string
}

interface GetProfileResponse {
	user: User
}

export async function getProfile() {
	const result = await api.get('profile').json<GetProfileResponse>()

	return result
}
