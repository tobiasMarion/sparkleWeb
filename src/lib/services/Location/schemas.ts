import { z } from 'zod'

export const locationSchema = z.object({
	latitude: z.number().min(-90).max(90),
	longitude: z.number().min(-180).max(180),
	horizontalAccuracy: z.number(),
	altitude: z.number(),
	verticalAccuracy: z.number()
})

export type Location = z.infer<typeof locationSchema>

export const exactLocationSchema = z.object({
	latitude: z.number().min(-90).max(90),
	longitude: z.number().min(-180).max(180)
})

export type ExactLocation = z.infer<typeof exactLocationSchema>

export const participantSchema = z.object({
	deviceId: z.string(),
	location: locationSchema
})

export type Participant = z.infer<typeof participantSchema>

export const authMessageSchema = z.object({
	type: z.literal('AUTHENTICATION'),
	token: z.string()
})

export const locationUpdateSchema = z.object({
	type: z.literal('LOCATION_UPDATE_REPORT'),
	deviceId: z.string(),
	location: locationSchema
})

export const userJoinedSchema = z.object({
	type: z.literal('USER_JOINED'),
	deviceId: z.string(),
	location: locationSchema
})

export const distanceSchema = z.object({
	type: z.literal('DISTANCE'),
	to: z.string(),
	distance: z.number().nullable()
})

export const userLeftSchema = z.object({
	type: z.literal('USER_LEFT'),
	deviceId: z.string()
})

export const setPointSchema = z.object({
	type: z.literal('SET_POINT'),
	absolute: z.object({ x: z.number(), y: z.number(), z: z.number() }),
	relative: z
		.object({
			x: z.number().int(),
			y: z.number().int(),
			z: z.number().int()
		})
		.nullable()
})

export const messageSchemas = {
	AUTH: authMessageSchema,
	LOCATION_UPDATE_REPORT: locationUpdateSchema,
	USER_JOINED: userJoinedSchema,
	DISTANCE: distanceSchema,
	USER_LEFT: userLeftSchema,
	SET_POINT: setPointSchema
} as const

export type MessageTypes = keyof typeof messageSchemas

export type MessageMap = {
	[K in MessageTypes]: z.infer<(typeof messageSchemas)[K]>
}

export type SendableMessage = MessageMap['AUTH']
export type ReceivableMessage = Exclude<MessageMap[keyof MessageMap], SendableMessage>

export type SendableMessageType = ReceivableMessage['type']
export type ReceivableMessageType = ReceivableMessage['type']

export const sendableMessageSchema = authMessageSchema
export const receivableMessageSchema = z.discriminatedUnion('type', [
	locationUpdateSchema,
	userJoinedSchema,
	distanceSchema,
	userLeftSchema,
	setPointSchema
])

export type Listener<T extends ReceivableMessage['type']> = (
	message: Extract<ReceivableMessage, { type: T }>
) => void

export type ListenersMap = {
	[K in ReceivableMessage['type']]: Set<Listener<K>>
}

type SafeParseReturn<T> =
	{ success: true, error: null, data: T } |
	{ success: false, error: z.ZodFormattedError<T> | { message: string }, data: null }

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
