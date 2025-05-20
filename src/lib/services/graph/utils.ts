import { Vector3 } from 'three'
import type { Edge, Vector } from './schemas'

export type NotWeightedEdge = Pick<Edge, 'from' | 'to'>

export function getEdgeId({ from, to }: NotWeightedEdge): string {
	return `${from}->${to}`
}

export function vectorToArray(v: Vector): [number, number, number] {
	const { x, y, z } = v

	return [x, y, z]
}

export function vectorToThreeVector3(v: Vector) {
	const { x, y, z } = v

	return new Vector3(x, y, z)
}
