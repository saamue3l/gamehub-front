import { getCsrfCookie } from '@/api/getCsrfCookie'
import type { LoginPost, LoginResponse } from '@/types/Login'
import { httpBackend } from '@/lib/utils'

export async function fetchLoginPost(values: LoginPost): Promise<LoginResponse> {
  await getCsrfCookie()

  try {
    const data = await httpBackend<LoginResponse>('/api/login', 'POST', values, false)
    storeSessionData(data)
    return data
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Échec de la connexion.')
  }
}

function storeSessionData(data: LoginResponse) {
  sessionStorage.setItem('token', data.token)
  sessionStorage.setItem('username', data.user.username)
  sessionStorage.setItem('roleId', data.user.roleId.toString())
  sessionStorage.setItem('statusId', data.user.statusId.toString())
  sessionStorage.setItem('xp', data.user.xp.toString())
  sessionStorage.setItem('picture', data.user.picture)
}
