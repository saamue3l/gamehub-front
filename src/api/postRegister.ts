import type { RegisterPost, RegisterResponse } from '@/types/Register'
import { postLogin } from '@/api/postLogin'
import { httpBackend } from '@/lib/utils'
import type { LoginPost } from '@/types/Login'

export async function postRegister(values: RegisterPost): Promise<RegisterResponse> {
  try {
    const data = await httpBackend<RegisterResponse>('/api/register', 'POST', values, false)

    const loginValues: LoginPost = {
      email: data.user.email,
      password: values.password
    }
    await postLogin(loginValues)
    return data
  } catch (error) {
    const errorMessage = error.status.includes('422')
      ? 'Erreur de validation des données'
      : 'Veuillez réessayer plus tard'

    throw new Error(errorMessage)
  }
}
