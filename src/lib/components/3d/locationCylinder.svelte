<script lang="ts">
	import { T } from '@threlte/core'
	import { FakeGlowMaterial } from '@threlte/extras'
	import * as THREE from 'three'

	interface Positon {
		x: number
		y: number
		z: number
	}

	interface Props {
		cylinder: {
			position: Positon
			radius: number
			height: number
		}
		particle: Positon
	}

	let { cylinder, particle }: Props = $props()
	let { radius, height, position } = cylinder
	let { x, y, z } = particle

	const cylinderGeometry = new THREE.CylinderGeometry(radius, radius, height, 16)

	const edgeGeometry = new THREE.EdgesGeometry(cylinderGeometry)
</script>

<T.LineSegments position={[position.x, position.y, position.z]} geometry={edgeGeometry}>
	<T.LineBasicMaterial color="white" />
</T.LineSegments>

<T.Mesh position={[x, y, z]} scale={0.25}>
	<T.SphereGeometry />
	<FakeGlowMaterial glowColor="red" />
</T.Mesh>
