<script lang="ts">
	import { cn } from '$lib/utils'
	import type { Snippet } from 'svelte'
	import Button from './button.svelte'

	import type { HTMLButtonAttributes } from 'svelte/elements'

	interface ButtonProps extends HTMLButtonAttributes {
		children: Snippet
	}

	let { children, ...restProps }: ButtonProps = $props()
</script>

<Button
	{...restProps}
	class={cn(
		'bg-transparent hover:bg-tranparent text-xs text-muted-foreground border border-zinc-950 hover:border-zinc-800 flex items-center',
		restProps.class
	)}
>
	{@render children()}
</Button>
