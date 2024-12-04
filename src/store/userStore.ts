import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { httpBackend } from '@/lib/utils'
import type { ConnectedUserInfo } from '@/types/UserInfo'

export const UserStore = defineStore('userStore', () => {
  // État de base
  const username = ref('')
  const xp = ref(0)
  const profilePicture = ref('')
  const roleId = ref<string | null>(null)

  // Getters calculés
  const level = computed(() => Math.floor(xp.value / 100))
  const xpInCurrentLevel = computed(() => xp.value % 100)
  const isAdmin = computed(() => roleId.value === 1)

  // Action pour initialiser le store
  async function initializeStore() {
    if (!localStorage.getItem('token')) {
      return
    }

    try {
      const response = await httpBackend<ConnectedUserInfo>(`/api/me`)

      console.log('User data fetched:', response)
      username.value = response.username
      xp.value = response.xp
      profilePicture.value = response.profilePicture
      roleId.value = response.roleId
    } catch (error) {
      console.error('Failed to fetch user data:', error)
      resetStore()
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
