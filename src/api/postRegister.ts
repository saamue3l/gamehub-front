import type { RegisterPost, RegisterResponse } from '@/types/Register'
import { postLogin } from '@/api/postLogin'
import { httpBackend } from '@/lib/utils'
import type { LoginPost } from '@/types/Login'
import { UserStore } from '@/store/userStore'

export async function postRegister(values: RegisterPost): Promise<RegisterResponse> {
  try {
    const data = await httpBackend<RegisterResponse>('/api/register', 'POST', values, false)

    const userStore = UserStore()

    const loginValues: LoginPost = {
      email: data.user.email,
      password: values.password
    }
    await postLogin(loginValues)
    await userStore.initializeStore()

    return data
  } catch (error) {
    console.error('Error while registering', error)

    throw new Error(error.message)
  }
}
