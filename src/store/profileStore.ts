import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { UserStore } from '@/store/userStore'

export const useProfileStore = defineStore('profile', () => {
  const route = useRoute()
  const userStore = UserStore()

  const isOwnProfile = computed(() => {
    return route.params.username === userStore.username
  })

  return {
    isOwnProfile
  }
})
