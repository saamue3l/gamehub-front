import { ref } from 'vue'
import { defineStore } from 'pinia'

export const UserStore = defineStore('userStore', () => {
  const storedUsername = sessionStorage.getItem('username')

  const username = ref(storedUsername !== null ? storedUsername : '')

  function setUsername() {
    username.value = sessionStorage.getItem('username')
  }

  function resetUsername() {
    username.value = ''
  }

  function isAdmin(): boolean {
    return sessionStorage.getItem('roleId') == '1' ?? false
  }

  return { username, setUsername, resetUsername, isAdmin }
})
