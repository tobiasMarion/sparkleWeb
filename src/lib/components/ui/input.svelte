<script lang="ts">
	import { cn } from '$lib/utils'
	import type { HTMLInputAttributes } from 'svelte/elements'

	let {
		value = $bindable(),
		readonly,
		class: className,
		...restProps
	}: HTMLInputAttributes = $props()
</script>

<input
	class={cn(
		`border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${readonly ? 'text-muted-foreground pointer-events-none text-xs' : ''}`,
		className
	)}
	bind:value
	{readonly}
	{...restProps}
/>
