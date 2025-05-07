import { browser } from '$app/environment'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function getCookieFromBrowser(name: string): string | undefined {
	if (!browser || typeof document === 'undefined') {
		return undefined
	}

	const cookieString = document.cookie
	if (!cookieString) {
		return undefined
	}

	const value = `; ${cookieString}`
	const parts = value.split(`; ${name}=`)

	if (parts.length !== 2) {
		return undefined
	}

	const cookiePart = parts.pop()
	if (!cookiePart) {
		return undefined
	}

	return cookiePart.split(';')[0]
}
