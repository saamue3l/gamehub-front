export async function getCsrfCookie(): Promise<void> {
  await fetch(`${import.meta.env.VITE_BACKEND_HOST}/sanctum/csrf-cookie`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    }
  })
}
