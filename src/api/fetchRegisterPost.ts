import type { RegisterPost } from '@/types/Register'
import type { RegisterResponse } from '@/types/Register'
import { fetchLoginPost } from '@/api/fetchLoginPost'

export async function fetchRegisterPost(values: RegisterPost): Promise<RegisterResponse> {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_HOST}/api/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    },
    body: JSON.stringify(values),
    credentials: 'include'
  })
  const data = await response.json()
  if (response.ok) {
    const loginValues = {
      email: data.user.email,
      password: values.password
    }
    await fetchLoginPost(loginValues)
    return data
  } else {
    throw new Error(data.message || 'Échec de l’inscription.')
  }
}
