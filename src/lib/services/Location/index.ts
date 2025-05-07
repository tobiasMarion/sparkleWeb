export interface AuthMessage {
	type: 'AUTHENTICATION'
	token: string
}

export interface ExactLocation {
	latitude: number
	longitude: number
}

export interface Location {
	altitude: number
	horizontalAccuracy: number
	number: number
	latitude: number
	longitude: number
	verticalAccuracy: number
}

export interface User {
	deviceId: string
	location: Location
}

export interface UserJoinedMessage extends User {
	type: 'USER_JOINED'
}

export interface LocationUpdate extends User {
	type: 'LOCATION_UPDATE'
}

export interface UserLeftMessage {
	type: 'USER_LEFT'
	deviceId: string
}

export interface Effect {
	type: 'EFFECT'
	name: 'PULSE'
}

export interface MessageMap {
	AUTHENTICATION: AuthMessage
	USER_JOINED: UserJoinedMessage
	USER_LEFT: UserLeftMessage
}

export type Message = MessageMap[keyof MessageMap]
