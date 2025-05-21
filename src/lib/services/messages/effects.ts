import { z } from 'zod'
import type { NodePosition } from '../graph/schemas'
import { XZDistanceFromOrigin } from '../graph/utils'

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

export type Effect = z.infer<typeof effectSchema>
export type EffectTypes = Effect['name']

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
		{ coordinateType, activeTime, spreadDelayPerUnit }: EffectTypeMap['PULSE'],
		position: NodePosition,
		setState: (s: boolean) => void
	) {
		const { relative, absolute } = position.simulated
		const coord = coordinateType == 'ABSOLUTE' ? absolute : relative

		const distance = XZDistanceFromOrigin(coord)

		const waitFor = distance * spreadDelayPerUnit
		const waitForTurnOff = waitFor + activeTime

		setTimeout(() => { setState(true) }, waitFor)
		setTimeout(() => { setState(false) }, waitForTurnOff)
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
