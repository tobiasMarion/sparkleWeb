<script lang="ts">
	import MapInput from '$lib/components/mapInput.svelte'
	import H2 from '$lib/components/typo/h2.svelte'
	import Lead from '$lib/components/typo/lead.svelte'
	import P from '$lib/components/typo/p.svelte'
	import Input from '$lib/components/ui/input.svelte'

	function onLocationSelected(location: Location) {
		console.log(location)
	}
</script>

<div class="flex w-full gap-8">
	<form class="w-3/5 space-y-4">
		<H2>Create Event</H2>
		<Lead>Let's capture a million fireflies</Lead>

		<div>
			<label for=""><P>Event name:</P></label>
			<Input />
		</div>

		<div></div>
	</form>

	<div class="w-full overflow-hidden rounded-lg border">
		<MapInput {onLocationSelected} />
	</div>
</div>
