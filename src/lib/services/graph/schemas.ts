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

const vectorSchema = z.object({
	x: z.number(),
	y: z.number(),
	z: z.number()
})

export type Vector = z.infer<typeof vectorSchema>

export const positionSchema = z.object({
	relative: vectorSchema,
	absolute: vectorSchema
})

export type NodePosition = z.infer<typeof positionSchema>

export interface Graph {
	nodes: Record<
		Node,
		{
			location: Location
			position?: NodePosition
		}
	>
	edges: Edge[]
}
