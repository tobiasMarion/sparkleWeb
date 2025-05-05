<script lang="ts">
	import sparkleIcon from '$lib/assets/sparkle-icon.svg'
	import ProfileButton from '$lib/components/profileButton.svelte'

	const { children } = $props()
</script>

<div class="space-y-8">
	<header>
		<div
			class="mx-auto flex max-w-screen-xl items-center justify-between border-zinc-900 px-8 py-6"
		>
			<a href="/app" class="flex items-center gap-4">
				<img src={sparkleIcon} alt="Sparkle logo" class="h-8 border-r border-zinc-900 pr-4" />
				<strong class="text-zinc-600">Sparkle.</strong>
			</a>
			<ProfileButton />
		</div>
	</header>
	<main class="mx-auto flex max-w-screen-xl flex-col items-center px-8 pb-16">
		{@render children()}
	</main>
</div>
