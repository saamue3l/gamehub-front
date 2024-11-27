import { getCsrfCookie } from '@/api/getCsrfCookie'
import { httpBackend } from '@/lib/utils'

export const postLogout = async () => {
  try {
    await getCsrfCookie()
    await httpBackend('/api/logout', 'POST')
    await clearAllStorage()
  } catch (error) {
    throw new Error('La déconnexion a échouer, veuillez reessayer')
  }
}

function clearAllStorage() {
  localStorage.removeItem('token')
  localStorage.clear()
}
