<script lang="ts">
	import type { Snippet } from 'svelte'

	const { children, onclick }: { onclick?: () => void; children: Snippet } = $props()
</script>

<button
	{onclick}
	class="bg-zinc-900 flex items-center text-zinc-600 hover:text-accent-foreground justify-center aspect-square rounded-2xl p-4 shadow transition cursor-pointer hover:bg-zinc-900/70 active:ring"
>
	{@render children()}
</button>
