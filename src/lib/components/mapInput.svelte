<script lang="ts">
	import 'mapbox-gl/dist/mapbox-gl.css'
	import { PUBLIC_MAPBOX_PUBLIC_TOKEN } from '$env/static/public'
	import { onMount } from 'svelte'
	import mapboxgl from 'mapbox-gl'
	import type { ExactLocation } from '$lib/services/location/schemas'

	mapboxgl.accessToken = PUBLIC_MAPBOX_PUBLIC_TOKEN

	let mapContainer: HTMLDivElement

	interface Props {
		height?: number
		onLocationSelected: (location: ExactLocation) => void
	}

	let { onLocationSelected, height = 300 }: Props = $props()

	let currentMarker: mapboxgl.Marker | null = null

	onMount(() => {
		const map = new mapboxgl.Map({
			container: mapContainer,
			style: 'mapbox://styles/mapbox/streets-v11',
			center: [-51.23, -30.03],
			zoom: 12
		})

		map.on('click', (e) => {
			const { lng, lat } = e.lngLat

			if (currentMarker) {
				currentMarker.remove()
			}

			currentMarker = new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map)

			onLocationSelected?.({ latitude: lat, longitude: lng })
		})

		return () => map.remove()
	})
</script>

<div bind:this={mapContainer} class="map-container" style="height: {height}px; width: 100%;"></div>
