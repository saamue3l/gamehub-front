import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { httpBackend } from '@/lib/utils'
import type { ConnectedUserInfo } from '@/types/UserInfo'
import { useRouter } from 'vue-router'

export const UserStore = defineStore('userStore', () => {
  // État de base
  const username = ref('')
  const xp = ref(0)
  const profilePicture = ref('')
  const roleId = ref<number | null>(null)

  // Getters calculés
  const level = computed(() => Math.floor(xp.value / 100))
  const xpInCurrentLevel = computed(() => xp.value % 100)
  const isAdmin = computed(() => roleId.value === 1)

  // Action pour initialiser le store
  async function initializeStore() {
    const token = localStorage.getItem('token')

    // Si pas de token, on ne fait rien
    if (!token) {
      return
    }

    try {
      // Vérifier si le token est valide via un endpoint dédié

      const response = await httpBackend<ConnectedUserInfo>(`/api/me`)

      // Si on arrive ici, le token est valide
      username.value = response.username
      xp.value = response.xp
      profilePicture.value = response.profilePicture
      roleId.value = Number(response.roleId)
    } catch (error) {
      const router = useRouter()

      // Si le token n'est pas valide, on nettoie tout
      console.error('Invalid token:', error)
      localStorage.removeItem('token')
      resetStore()

      await router.push('/')
    }
  }

  async function updateUsername(newUsername: string) {
    try {
      username.value = newUsername
    } catch (error) {
      console.error('Failed to update username:', error)
      throw error
    }
  }

  async function updateXp(newXp: number) {
    try {
      xp.value = newXp
    } catch (error) {
      console.error('Failed to update XP:', error)
      throw error
    }
  }

  async function updateProfilePicture(newProfilePicture: string) {
    try {
      profilePicture.value = newProfilePicture
    } catch (error) {
      console.error('Failed to update profile picture:', error)
      throw error
    }
  }

  // Action pour réinitialiser le store
  function resetStore() {
    username.value = ''
    xp.value = 0
    profilePicture.value = ''
    roleId.value = null
  }

  return {
    // État
    username,
    xp,
    profilePicture,

    // Getters calculés
    level,
    xpInCurrentLevel,
    isAdmin,

    // Actions
    initializeStore,
    updateUsername,
    updateProfilePicture,
    updateXp,
    resetStore
  }
})
