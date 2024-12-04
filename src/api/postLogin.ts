import { getCsrfCookie } from '@/api/getCsrfCookie'
import type { LoginPost, LoginResponse } from '@/types/Login'
import { httpBackend } from '@/lib/utils'
import { UserStore } from '@/store/userStore'

export async function postLogin(values: LoginPost): Promise<LoginResponse> {
  await getCsrfCookie()

  try {
    const data = await httpBackend<LoginResponse>('/api/login', 'POST', values, false)
    localStorage.setItem('token', data.token)

    const userStore = UserStore()
    userStore.username = data.user.username
    userStore.xp = data.user.xp
    if (data.user.picture) {
      userStore.profilePicture = data.user.picture
    }

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
