import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * TODO : Implémenter les token d'authentification
 * @param path 
 * @param method 
 * @param body 
 * @returns 
 */
export async function httpBackend<T>(
  path: string,
  method: 'GET' | 'POST' = 'GET',
  body?: any
): Promise<T> {
  const response = await fetch(import.meta.env.VITE_BACKEND_HOST + path, {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return await response.json()
}
