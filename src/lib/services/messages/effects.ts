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
	}),
	ROTATE: z.object({
		name: z.literal('ROTATE'),
		activeTime: z.number().nonnegative(),
		spreadDelayPerRadian: z.number().nonnegative()
	}),
	SPIRAL: z.object({
		name: z.literal('SPIRAL'),
		activeTime: z.number().nonnegative(),
		radialSpeed: z.number().nonnegative(),
		angularSpeed: z.number().nonnegative()
	})
} as const

export const effectSchema = z.discriminatedUnion('name', [
	effectSchemas.PULSE,
	effectSchemas.WAVE,
	effectSchemas.ROTATE,
	effectSchemas.SPIRAL
])

export type Effect = z.infer<typeof effectSchema>
export type EffectTypes = Effect['name']

export type EffectTypeMap = {
	[K in EffectTypes]: Extract<Effect, { name: K }>
}

export type UpdatePreviewOnEffect<E extends EffectTypes> = (
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
		const { direction, activeTime, spreadDelayPerUnit } = effect
		const { x, y, z } = position.simulated.relative

		let distance: number

		switch (direction) {
			case 'X':
				distance = x
				break

			case 'Y':
				distance = y
				break

			case 'Z':
				distance = z
				break
		}

		const waitFor = distance * spreadDelayPerUnit
		const waitForTurnOff = waitFor + activeTime

		setTimeout(() => { setState(true) }, waitFor)
		setTimeout(() => { setState(false) }, waitForTurnOff)
	},

	ROTATE: function (
		{ activeTime, spreadDelayPerRadian }: EffectTypeMap['ROTATE'],
		position: NodePosition,
		setState: (s: boolean) => void
	) {
		const { x, z } = position.simulated.absolute

		const angle = Math.atan2(z, x)  // [-π, π]
		const angleNormalized = (angle + 2 * Math.PI) % (2 * Math.PI) // [0, 2π]

		const waitFor = angleNormalized * spreadDelayPerRadian
		const waitForTurnOff = waitFor + activeTime

		setTimeout(() => { setState(true) }, waitFor)
		setTimeout(() => { setState(false) }, waitForTurnOff)
	},

	SPIRAL: function (
		{ radialSpeed, angularSpeed, activeTime }: EffectTypeMap['SPIRAL'],
		position: NodePosition,
		setState: (s: boolean) => void
	) {
		const { x, z } = position.simulated.absolute
		const angle = Math.atan2(z, x)
		const distance = Math.sqrt(x * x + z * z)

		const waitFor = (distance * radialSpeed) + (angle * angularSpeed)
		const waitForTurnOff = waitFor + activeTime

		setTimeout(() => { setState(true) }, waitFor)
		setTimeout(() => { setState(false) }, waitForTurnOff)
	}
}
