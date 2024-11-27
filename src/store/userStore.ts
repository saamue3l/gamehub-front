import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const UserStore = defineStore('userStore', () => {
  const storedUsername = localStorage.getItem('username')
  const username = ref(storedUsername !== null ? storedUsername : '')
  const storedXp = localStorage.getItem('xp')
  const xp = ref(storedXp ? parseInt(storedXp) : 0)
  const storedProfilePicture = localStorage.getItem('picture')
  const profilePicture = ref(storedProfilePicture || '')

  const level = computed(() => Math.floor(xp.value / 100))
  const xpInCurrentLevel = computed(() => xp.value % 100)

  function setUsername() {
    username.value = localStorage.getItem('username') || ''
  }

  function setXp() {
    xp.value = parseInt(localStorage.getItem('xp'))
  }

  function setProfilePicture() {
    profilePicture.value = localStorage.getItem('picture') || ''
  }

  function resetUsername() {
    username.value = ''
    localStorage.removeItem('username')

    profilePicture.value = ''
    localStorage.removeItem('profilePicture')
  }

  function isAdmin(): boolean {
    return localStorage.getItem('roleId') === '1'
  }

  function updateXp(newXp: number) {
    xp.value = newXp
    localStorage.setItem('xp', xp.value.toString())
  }

  function resetXp() {
    xp.value = 0
    localStorage.removeItem('xp')
  }

  return {
    username,
    xp,
    level,
    xpInCurrentLevel,
    profilePicture,
    setUsername,
    setXp,
    setProfilePicture,
    resetUsername,
    isAdmin,
    updateXp,
    resetXp
  }
})
