import type { RegisterPost, RegisterResponse } from '@/types/Register'
import { fetchLoginPost } from '@/api/fetchLoginPost'
import { httpBackend } from '@/lib/utils'

export async function fetchRegisterPost(values: RegisterPost): Promise<RegisterResponse> {
  try {
    const data = await httpBackend<RegisterResponse>('/api/register', 'POST', values, false)

    const loginValues = {
      email: data.user.email,
      password: values.password
    }

    await fetchLoginPost(loginValues)
    return data
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Échec de l'inscription .")
  }
}
