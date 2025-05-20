import { z } from 'zod'
import type { Location } from '../location/schemas'

export const nodeSchema = z.string()
export const edgeSchema = z.object({
	from: nodeSchema,
	to: nodeSchema,
	value: z.number()
})

export type Node = z.infer<typeof nodeSchema>
export type Edge = z.infer<typeof edgeSchema>

const vector3Schema = z.object({
	x: z.number(),
	y: z.number(),
	z: z.number()
})

export type Vector = z.infer<typeof vector3Schema>

export const positionPair = z.object({
	relative: vector3Schema,
	absolute: vector3Schema
})

export const positionSchema = z.object({
	uncorrected: positionPair,
	simulated: positionPair
})

export type NodePosition = z.infer<typeof positionSchema>
export type NodeMetadata = {
	location: Location
	position?: NodePosition
}
export type NodesRecord = Record<Node, NodeMetadata>

export interface Graph {
	nodes: NodesRecord
	edges: Edge[]
}
