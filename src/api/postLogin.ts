import { getCsrfCookie } from '@/api/getCsrfCookie'
import type { LoginPost, LoginResponse } from '@/types/Login'
import { httpBackend } from '@/lib/utils'

export async function postLogin(values: LoginPost): Promise<LoginResponse> {
  await getCsrfCookie()

  try {
    const data = await httpBackend<LoginResponse>('/api/login', 'POST', values, false)
    storeLocalData(data)
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

function storeLocalData(data: LoginResponse) {
  localStorage.setItem('token', data.token)
  localStorage.setItem('username', data.user.username)
  localStorage.setItem('roleId', data.user.roleId.toString())
  localStorage.setItem('statusId', data.user.statusId.toString())
  localStorage.setItem('xp', data.user.xp.toString())
  if (data.user.picture) {
    localStorage.setItem('picture', data.user.picture.toString())
  }
}
