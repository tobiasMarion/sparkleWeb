<script lang="ts">
	import { Button } from 'bits-ui'

	let { children, ...restProps } = $props()
</script>

<Button.Root
	{...restProps}
	class="bg-primary text-background hover:bg-primary/95 inline-flex items-center justify-center rounded-lg px-4 py-2 font-semibold
	shadow active:scale-[0.98] active:transition-all"
>
	{@render children()}
</Button.Root>
