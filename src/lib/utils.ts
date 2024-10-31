import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { CalendarDate } from '@internationalized/date'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Transform a CalendarDate to a native js date
 * @param dateValue
 */
export function toNativeDate(dateValue: CalendarDate): Date | null {
  if (dateValue && dateValue.year && dateValue.month && dateValue.day) {
    return new Date(dateValue.year, dateValue.month - 1, dateValue.day) // Month is 0-indexed in JS Date
  }
  return null
}

/**
 * TODO : Implémenter les token d'authentification
 * @param path The path for the url
 * @param method The method to for the request
 * @param body An array representing the body of the request
 * @param auth Does the request need authentification with token ?
 * @returns
 */
export async function httpBackend<T>(
  path: string,
  method: 'GET' | 'POST' = 'GET',
  body?: any[],
  auth: boolean = true
): Promise<T> {
  const token = sessionStorage.getItem('token')

  const response = await fetch(import.meta.env.VITE_BACKEND_HOST + path, {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return await response.json()
}
