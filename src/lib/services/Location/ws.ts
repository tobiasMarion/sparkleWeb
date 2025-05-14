import { getCookieFromBrowser } from '$lib/utils'
import { PUBLIC_BACKEND_DOMAIN } from '$env/static/public'
import {
	receivableMessageSchema,
	safeParseJsonMessage,
	type Listener,
	type ListenersMap,
	type ReceivableMessageType,
	type SendableMessage
} from './schemas'

let socket: WebSocket | null = null

const listeners: ListenersMap = {
	LOCATION_UPDATE_REPORT: new Set(),
	USER_JOINED: new Set(),
	DISTANCE_REPORT: new Set(),
	USER_LEFT: new Set(),
	SET_POINT_REPORT: new Set()
}

export function connectWebSocket(eventId: string) {
	if (socket) return

	const url = `ws://${PUBLIC_BACKEND_DOMAIN}/events/${eventId}/admin`
	socket = new WebSocket(url)

	socket.onopen = () => {
		const token = getCookieFromBrowser('token')

		if (!token) {
			socket?.close()
			console.error('Could not connect to server')

			return
		}

		sendMessage({ type: 'AUTHENTICATION', token })
		console.log('WebSocket connection established')
	}

	socket.onclose = () => {
		console.log('WebSocket connection closed')
		socket = null
	}

	socket.onmessage = ({ data }) => {
		const { data: message, success, error } = safeParseJsonMessage(data, receivableMessageSchema)

		if (!success) {
			console.warn('Invalid message received:', error)
			return
		}

		const handlers = listeners[message.type] as Set<Listener<typeof message.type>>

		handlers.forEach((handler) => handler(message))
	}
}

export function disconnect() {
	socket?.close()
}

export function sendMessage(message: SendableMessage) {
	socket?.send(JSON.stringify(message))
}

export function addListener<K extends ReceivableMessageType>(type: K, listener: Listener<K>) {
	listeners[type].add(listener)
}

export function removeListener<K extends ReceivableMessageType>(type: K, listener: Listener<K>) {
	listeners[type].delete(listener)
}
