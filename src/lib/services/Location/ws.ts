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
	DISTANCE: new Set(),
	USER_LEFT: new Set(),
	SET_POINT: new Set()
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
		console.log('Conexão WebSocket estabelecida')
	}

	socket.onclose = () => {
		console.log('Conexão WebSocket encerrada')
		socket = null
	}

	socket.onmessage = ({ data }) => {
		const parsed = safeParseJsonMessage(data, receivableMessageSchema)

		if (!parsed.success) {
			console.warn('Mensagem inválida recebida:', parsed.error)
			return
		}

		const message = parsed.data

		switch (message.type) {
			case 'USER_JOINED':
				listeners.USER_JOINED.forEach((handler) => handler(message))
				break
			case 'USER_LEFT':
				listeners.USER_LEFT.forEach((handler) => handler(message))
				break
			default:
				console.warn('Tipo de mensagem desconhecido recebido:', message)
		}
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
