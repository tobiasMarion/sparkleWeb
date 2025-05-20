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
	PULSE: function (
		effect: EffectTypeMap['PULSE'],
		position: NodePosition,
		setState: (s: boolean) => void
	) {
		console.log(effect, position, setState)
		throw new Error('Function not implemented.')
	},
	WAVE: function (
		effect: EffectTypeMap['WAVE'],
		position: NodePosition,
		setState: (s: boolean) => void
	) {
		console.log(effect, position, setState)
		throw new Error('Function not implemented.')
	}
}
