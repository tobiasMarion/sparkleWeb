import { api } from './apiClient';

interface SignInWithGitHubRequest {
	code: string;
}

interface SignInWithGitHubResponse {
	token: string;
}

export async function signInWithGitHub({ code }: SignInWithGitHubRequest) {
	const result = await api
		.post('sessions/github', { json: { code } })
		.json<SignInWithGitHubResponse>();

	return result;
}
