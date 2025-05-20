import { z } from 'zod'
import type { NodePosition } from '../graph/schemas'

const coordTypesSchema = z.enum(['ABSOLUTE', 'RELATIVE'])
const directionsSchema = z.enum(['X', 'Y', 'Z'])

const effectSchemas = {
	PULSE: z.object({
		name: z.literal('PULSE'),
		coordinateType: coordTypesSchema,
		activeTime: z.number().nonnegative(),
		spreadDelayPerUnit: z.number().nonnegative()
	}),
	WAVE: z.object({
		name: z.literal('WAVE'),
		direction: directionsSchema,
		activeTime: z.number().nonnegative(),
		spreadDelayPerUnit: z.number().nonnegative()
	})
} as const

export const effectSchema = z.discriminatedUnion('name', [effectSchemas.PULSE, effectSchemas.WAVE])

type Effect = z.infer<typeof effectSchema>
type EffectTypes = Effect['name']

export type EffectTypeMap = {
	[K in EffectTypes]: Extract<Effect, { name: K }>
}

type UpdatePreviewOnEffect<E extends EffectTypes> = (
	effect: EffectTypeMap[E],
	position: NodePosition,
	setState: (s: boolean) => void
) => void

type PreviewUpdaters = {
	[K in EffectTypes]: UpdatePreviewOnEffect<K>
}

export const previewUpdaters: PreviewUpdaters = {
	PULSE: function (effect: { name: 'PULSE'; coordinateType: 'ABSOLUTE' | 'RELATIVE'; activeTime: number; spreadDelayPerUnit: number }, position: NodePosition, setState: (s: boolean) => void): void {
		throw new Error('Function not implemented.')
	},
	WAVE: function (effect: { name: 'WAVE'; activeTime: number; spreadDelayPerUnit: number; direction: 'X' | 'Y' | 'Z' }, position: NodePosition, setState: (s: boolean) => void): void {
		throw new Error('Function not implemented.')
	}
}