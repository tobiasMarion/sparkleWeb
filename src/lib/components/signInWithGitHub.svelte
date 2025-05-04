<script lang="ts">
	import githubIcon from '$lib/assets/github-icon.svg'
	import { PUBLIC_GITHUB_OAUTH_CLIENT_ID as clientId } from '$env/static/public'
	import { PUBLIC_GITHUB_OAUTH_CLIENT_REDIRECT_URI as redirectURI } from '$env/static/public'

	const githubSignInUrl = new URL('https://github.com/login/oauth/authorize')
	githubSignInUrl.searchParams.set('client_id', clientId)
	githubSignInUrl.searchParams.set('redirect_uri', redirectURI)
	githubSignInUrl.searchParams.set('scope', 'user')
</script>

<a href={githubSignInUrl.toString()} class="flex items-center">
	<img src={githubIcon} class="mr-2 size-4 dark:invert" alt="GitHub icon" />
	Sign in with GitHub
</a>
