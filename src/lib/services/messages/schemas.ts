import { z } from 'zod'
import { locationSchema } from '../location/schemas'
import { effectSchema } from './effects'

const vector3Schema = z.object({
	x: z.number(),
	y: z.number(),
	z: z.number()
})

export const positionPair = z.object({
	relative: vector3Schema,
	absolute: vector3Schema
})

export const positionSchema = z.object({
	uncorrected: positionPair,
	simulated: positionPair
})

export const messageSchemas = {
	AUTH: z.object({
		type: z.literal('AUTHENTICATION'),
		token: z.string()
	}),

	LOCATION_UPDATE_REPORT: z.object({
		type: z.literal('LOCATION_UPDATE_REPORT'),
		deviceId: z.string(),
		location: locationSchema
	}),

	USER_JOINED: z.object({
		type: z.literal('USER_JOINED'),
		deviceId: z.string(),
		location: locationSchema
	}),

	DISTANCE_REPORT: z.object({
		type: z.literal('DISTANCE_REPORT'),
		from: z.string(),
		to: z.string(),
		distance: z.number().nullable()
	}),

	USER_LEFT: z.object({
		type: z.literal('USER_LEFT'),
		deviceId: z.string()
	}),

	SET_POINT_REPORT: z.object({
		type: z.literal('SET_POINT_REPORT'),
		deviceId: z.string(),
		position: positionSchema
	}),

	EFFECT: z.object({
		type: z.literal('EFFECT'),
		effect: effectSchema
	})
} as const

export type MessageTypes = keyof typeof messageSchemas

export type MessageMap = {
	[K in MessageTypes]: z.infer<(typeof messageSchemas)[K]>
}

export const receivableMessageSchema = z.discriminatedUnion('type', [
	messageSchemas.DISTANCE_REPORT,
	messageSchemas.EFFECT,
	messageSchemas.LOCATION_UPDATE_REPORT,
	messageSchemas.SET_POINT_REPORT,
	messageSchemas.USER_JOINED,
	messageSchemas.USER_LEFT
])

export const sendableMessageSchema = z.discriminatedUnion('type', [
	messageSchemas.EFFECT,
	messageSchemas.AUTH
])

export type SendableMessages = z.infer<typeof sendableMessageSchema>
export type ReceivableMessages = z.infer<typeof receivableMessageSchema>

export type SendableMessageTypes = SendableMessages['type']
export type ReceivableMessageTypes = ReceivableMessages['type']

export type Listener<T extends ReceivableMessageTypes> = (
	message: Extract<ReceivableMessages, { type: T }>
) => void

export type ListenersMap = {
	[K in ReceivableMessageTypes]: Set<Listener<K>>
}

interface SafeParseError<T> {
	success: false
	error: z.ZodFormattedError<T> | { message: string }
	data: null
}

type SafeParseReturn<T> = { success: true; error: null; data: T } | SafeParseError<T>

export function safeParseJsonMessage<T>(
	jsonString: string,
	schema: z.Schema<T>
): SafeParseReturn<T> {
	let parsedData: unknown

	try {
		parsedData = JSON.parse(jsonString)
	} catch {
		return { success: false, error: { message: 'Invalid JSON' }, data: null }
	}

	const result = schema.safeParse(parsedData)

	if (!result.success) {
		return { success: false, error: result.error.format(), data: null }
	}

	return { success: true, data: result.data, error: null }
}
