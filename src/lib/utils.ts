import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { CalendarDate } from '@internationalized/date'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function toNativeDate(dateValue: CalendarDate): Date | null {
  if (dateValue && dateValue.year && dateValue.month && dateValue.day) {
    return new Date(dateValue.year, dateValue.month - 1, dateValue.day) // Month is 0-indexed in JS Date
  }
  return null
}


export async function httpBackend<T>(
    path: string,
    method: 'GET' | 'POST' = 'GET',
    body?: any,
    auth: boolean = true
): Promise<T> {
  const token = localStorage.getItem('token');

  const headers: { [name: string]: string } = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (auth && token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(import.meta.env.VITE_BACKEND_HOST + path, {
      method,
      credentials: 'include',
      body: body ? JSON.stringify(body) : undefined,
      headers: headers
    });

    if (response.status === 401) {
      localStorage.removeItem('token');
      throw new Error('Session expirée. Veuillez vous reconnecter.');
    }

    const responseBody = await response.json();

    if (!response.ok) {
      throw new Error(responseBody.message || `Erreur HTTP: ${response.status}`);
    }

    return responseBody;
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error("Le serveur n'est pas disponible. Veuillez réessayer plus tard.");
    }
    throw error;
  }
}


export async function httpBackendWithData<T>(path: string, formData: FormData): Promise<T> {
  const token = localStorage.getItem('token');

  const headers: HeadersInit = {
    'Accept': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_HOST}${path}`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
      headers
    });

    if (response.status === 401) {
      localStorage.removeItem('token');
      throw new Error('Session expirée. Veuillez vous reconnecter.');
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Erreur HTTP: ${response.status}`);
    }

    return data;
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error("Le serveur n'est pas disponible. Veuillez réessayer plus tard.");
    }
    throw error;
  }
}


export function highlightSearch(text: string, search?: string) {
  if (!search) {
    return text
  }
  // first escape html characters in the text to prevent xss
  text = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const regex = new RegExp(search, 'gi')
  return text.replace(regex, (match) => `<span class="bg-yellow-100 text-black">${match}</span>`)
}
