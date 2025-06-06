<script lang="ts">
	import MapInput from '$lib/components/mapInput.svelte'
	import { H2, Lead, Muted, P } from '$lib/components/typo'
	import Input from '$lib/components/ui/input.svelte'
	import { RadioGroup } from 'bits-ui'
	import Button from '$lib/components/ui/button.svelte'
	import { enhance } from '$app/forms'
	import type { ExactLocation } from '$lib/services/location/schemas'

	let { form }: { form: { error?: string } | undefined } = $props()

	let latValue = $state<number>()
	let lonValue = $state<number>()
	let eventType = $state<string>()
	let eventName = $state<string>()

	function onLocationSelected({ latitude, longitude }: ExactLocation) {
		latValue = latitude
		lonValue = longitude
	}

	let isSubmitButtonActive = $derived(latValue && lonValue && eventType && eventName)
</script>

<div class="flex w-full gap-8">
	<form class="w-3/5 space-y-8" method="POST" use:enhance>
		<div>
			<H2>Create Event</H2>
			<Lead>Let's capture a million fireflies</Lead>
		</div>

		{#if form?.error}
			<p class="error">{form.error}</p>
		{/if}

		<div class="flex flex-col gap-2">
			<label for="event-name" class="cursor-pointer font-semibold">Event name</label>
			<Input bind:value={eventName} id="event-name" name="name" required />
		</div>

		<div class="flex flex-col gap-2">
			<label for={eventType ? eventType : 'TORCH'} class="cursor-pointer font-semibold"
				>Event type</label
			>

			<RadioGroup.Root
				class="flex gap-8"
				name="type"
				onValueChange={(value) => {
					eventType = value
				}}
			>
				<div class="group flex items-center transition-all">
					<RadioGroup.Item
						id="TORCH"
						value="TORCH"
						class="size-4 shrink-0 cursor-pointer rounded-full border transition-all duration-100 ease-in-out data-[state=checked]:border-4"
					/>
					<label for="TORCH" class="cursor-pointer pl-2">Torch</label>
				</div>
				<div class="group flex items-center transition-all">
					<RadioGroup.Item
						id="SCREEN"
						value="SCREEN"
						class="size-4 shrink-0 cursor-pointer rounded-full border transition-all duration-100 ease-in-out data-[state=checked]:border-4"
					/>
					<label for="SCREEN" class="cursor-pointer pl-2">Screen</label>
				</div>
			</RadioGroup.Root>
		</div>

		<div class="flex flex-col gap-2">
			<div>
				<P>Location</P>
				<Muted>Select it on the map</Muted>
			</div>

			<div class="flex gap-4">
				<Input
					bind:value={latValue}
					type="number"
					name="latitude"
					placeholder="LAT"
					readonly
					min={-90}
					max={90}
					required
				/>
				<Input
					bind:value={lonValue}
					type="number"
					name="longitude"
					placeholder="LON"
					readonly
					min={-180}
					max={180}
					required
				/>
			</div>
		</div>

		<Button disabled={!isSubmitButtonActive}>Create Event</Button>
	</form>

	<div class="w-full overflow-hidden rounded-lg border">
		<MapInput {onLocationSelected} height={600} />
	</div>
</div>
