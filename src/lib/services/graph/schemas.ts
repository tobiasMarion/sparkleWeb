import { z } from 'zod'

export const nodeSchema = z.string()
export const edgeSchema = z.object({
	from: nodeSchema,
	to: nodeSchema,
	value: z.number()
})

export type Node = z.infer<typeof nodeSchema>
export type Edge = z.infer<typeof edgeSchema>