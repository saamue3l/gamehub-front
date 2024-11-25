import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const UserStore = defineStore('userStore', () => {
  const storedUsername = sessionStorage.getItem('username')
  const username = ref(storedUsername !== null ? storedUsername : '')
  const storedXp = sessionStorage.getItem('xp')
  const xp = ref(storedXp ? parseInt(storedXp) : 0)

  const level = computed(() => Math.floor(xp.value / 100))
  const xpInCurrentLevel = computed(() => xp.value % 100)

  function setUsername() {
    username.value = sessionStorage.getItem('username') || ''
  }

  function setXp() {
    xp.value = parseInt(sessionStorage.getItem('xp'))
  }

  function resetUsername() {
    username.value = ''
  }

  function isAdmin(): boolean {
    return sessionStorage.getItem('roleId') === '1'
  }

  function updateXp(newXp: number) {
    xp.value = newXp
    sessionStorage.setItem('xp', xp.value.toString())
  }

  function resetXp() {
    xp.value = 0
    sessionStorage.removeItem('xp')
  }

  return {
    username,
    xp,
    level,
    xpInCurrentLevel,
    setUsername,
    setXp,
    resetUsername,
    isAdmin,
    updateXp,
    resetXp
  }
})
