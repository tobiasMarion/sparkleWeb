<script lang="ts">
	import { Switch as SwitchPrimitive } from 'bits-ui'
	import { cn } from '$lib/utils'

	let { class: className = '', checked = $bindable(false), small = false, ...restProps } = $props()
</script>

<SwitchPrimitive.Root
	bind:checked
	class={cn(
		small ? 'h-3 w-5' : 'h-6 w-11',
		`focus-visible:ring-ring focus-visible:ring-offset-background data-[state=checked]:bg-primary data-[state=unchecked]:bg-input peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`,
		className
	)}
	{...restProps}
>
	<SwitchPrimitive.Thumb
		class={cn(
			small
				? 'h-2 w-2 data-[state=checked]:translate-x-2'
				: 'h-5 w-5 data-[state=checked]:translate-x-5',
			`bg-background pointer-events-none block rounded-full shadow-lg ring-0 transition-transform data-[state=unchecked]:translate-x-0`
		)}
	/>
</SwitchPrimitive.Root>
