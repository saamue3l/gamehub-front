import { getCsrfCookie } from '@/api/getCsrfCookie'
import type { loginPost, loginResponse } from '@/types'

export async function fetchLoginPost(values: loginPost): Promise<loginResponse> {
  await getCsrfCookie()
  return fetch(`${import.meta.env.VITE_BACKEND_HOST}/api/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    },
    body: JSON.stringify(values),
    credentials: 'include'
  }).then(async (response) => {
    if (response.ok) {
      const data = await response.json()
      storeSessionData(data)
      return data
    } else {
      const errorResponse = response.json()
      throw new Error(errorResponse.message || 'Échec de la connexion.')
    }
  })
}

function storeSessionData(data) {
  sessionStorage.setItem('token', data.token)
  sessionStorage.setItem('username', data.user.username)
  sessionStorage.setItem('roleId', data.user.roleId)
  sessionStorage.setItem('statusId', data.user.statusId)
  sessionStorage.setItem('xp', data.user.xp)
  sessionStorage.setItem('picture', data.user.picture)
}
