<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { UserStore } from '@/store/userStore'
import { getCsrfCookie } from '@/api/getCsrfCookie'

function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null
  return null
}

onMounted(async () => {
  await getCsrfCookie()

  try {
    console.log('GoogleConnection mounted')

    console.log('All cookies:', document.cookie)

    const token = getCookie('access_token')
    const username = getCookie('username')
    const xp = getCookie('xp')
    const profilePicture = getCookie('profile_picture')

    console.log('Token from cookie:', token)
    if (token) {
      localStorage.setItem('token', token)
      console.log('Token stored in localStorage')

      const userStore = UserStore()
      userStore.resetStore()
      userStore.username = username || ''
      userStore.xp = xp ? parseInt(xp) : 0
      if (profilePicture) {
        userStore.profilePicture = profilePicture
      }

      await userStore.initializeStore()
      console.log('User store initialized')
      await router.push({ name: 'Profil', params: { username: userStore.username } })
      console.log('Redirecting to profile')
    } else {
      await router.push('/')
      console.log('Redirecting to home')
    }
  } catch (error) {
    console.error('Error fetching user:', error)
    await router.push('/')
    console.log('Redirecting to home due to error')
  }
})
</script>

<template>
  <div>Connexion en cours...</div>
</template>

<style scoped></style>