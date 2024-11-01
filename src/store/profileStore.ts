import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

export const useProfileStore = defineStore('profile', () => {
  const route = useRoute()

  const isOwnProfile = computed(() => {
    const loggedInUsername = sessionStorage.getItem('username')
    return route.params.username === loggedInUsername
  })

  return {
    isOwnProfile
  }
})
