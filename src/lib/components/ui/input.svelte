<script lang="ts">
	import { cn } from '$lib/utils.js'
	import type { HTMLInputAttributes } from 'svelte/elements'

	type Props = {
		value?: HTMLInputAttributes['value']
		readonly?: HTMLInputAttributes['readonly']
		class?: HTMLInputAttributes['class']
		[key: string]: any
	}

	let { value = $bindable(), readonly, class: className, ...restProps }: Props = $props()
</script>

<input
	class={cn(
		'border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
		className
	)}
	bind:value
	{readonly}
	{...restProps}
/>
