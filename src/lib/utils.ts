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
  body?: any,
  auth: boolean = true
): Promise<T> {
  const token = localStorage.getItem('token')

  const headers: { [name: string]: string } = {
    'Content-Type': 'application/json'
  }

  if (auth) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(import.meta.env.VITE_BACKEND_HOST + path, {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers: headers
  })

  const responseBody = await response.json()

  if (!response.ok) {
    const httpCodeError = `HTTP error! status: ${response.status}`
    console.error(httpCodeError)
    const errorString = responseBody.message ?? httpCodeError
    throw new Error(errorString)
  }

  return responseBody
}

/**
 * @param path The path for the url
 * @param formData The FormData object
 * @returns
 */
export async function httpBackendWithData<T>(path: string, formData: FormData): Promise<T> {
  const headers: HeadersInit = {
    Accept: 'application/json'
  }

  const token = localStorage.getItem('token')

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_HOST}${path}`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
      headers
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Data message ' + data.message)
      throw new Error(data.message || `HTTP error! status: ${response.status}`)
    }

    return data
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error("Le serveur n'est pas disponible. Veuillez réessayer plus tard.")
    } else {
      throw error
    }
  }
}

/**
 * Highlight the search text in the given text
 * @param text
 * @param search
 */
export function highlightSearch(text: string, search?: string) {
  if (!search) {
    return text
  }
  // first escape html characters in the text to prevent xss
  text = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const regex = new RegExp(search, 'gi')
  return text.replace(regex, (match) => `<span class="bg-yellow-100 text-black">${match}</span>`)
}
