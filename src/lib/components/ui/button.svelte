<script lang="ts">
	import { cn } from '$lib/utils'
	import { Button } from 'bits-ui'
	import type { Snippet } from 'svelte'

	import type { HTMLButtonAttributes } from 'svelte/elements'

	interface ButtonProps extends HTMLButtonAttributes {
		children: Snippet
	}

	let { children, ...restProps }: ButtonProps = $props()
</script>

<Button.Root
	{...restProps}
	class={cn(
		'bg-primary text-background hover:bg-primary/95 disabled:bg-primary/60 inline-flex cursor-pointer items-center justify-center rounded-lg px-4 py-2 font-semibold shadow transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:active:scale-[1]',
		restProps.class
	)}
>
	{@render children()}
</Button.Root>
