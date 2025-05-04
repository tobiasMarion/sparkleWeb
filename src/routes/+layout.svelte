<script lang="ts">
	import '../app.css'

	const { children } = $props()
</script>

<div class="dark min-h-svh bg-zinc-950 text-white antialiased">
	{@render children()}
</div>
