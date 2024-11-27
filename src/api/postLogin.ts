import { getCsrfCookie } from '@/api/getCsrfCookie'
import type { LoginPost, LoginResponse } from '@/types/Login'
import { httpBackend } from '@/lib/utils'

export async function postLogin(values: LoginPost): Promise<LoginResponse> {
  await getCsrfCookie()

  try {
    const data = await httpBackend<LoginResponse>('/api/login', 'POST', values, false)
    storeSessionData(data)
    return data
  } catch (error) {
    console.log(error)
    const errorMessage =
      error.message === 'Échec de la connexion, informations incorrectes.'
        ? error.message
        : 'Une erreur est survenue, veuillez réessayer plus tard.'

    throw new Error(errorMessage)
  }
}

function storeSessionData(data: LoginResponse) {
  console.log(data)
  sessionStorage.setItem('token', data.token)
  sessionStorage.setItem('username', data.user.username)
  sessionStorage.setItem('roleId', data.user.roleId.toString())
  sessionStorage.setItem('statusId', data.user.statusId.toString())
  sessionStorage.setItem('xp', data.user.xp.toString())
  if (data.user.picture) {
    sessionStorage.setItem('picture', data.user.picture.toString())
  }
}
