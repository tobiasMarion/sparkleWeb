<script lang="ts">
	let { children } = $props()
</script>

<blockquote class="mt-6 border-l-2 pl-6 italic">
	{@render children()}
</blockquote>
