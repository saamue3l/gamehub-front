import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Success } from '@/types/Success'
import { httpBackend } from '@/lib/utils'

export const useAchievementsStore = defineStore('achievements', () => {
  const achievements = ref<Success[]>([])
  const isLoading = ref(true)
  const error = ref<string | null>(null)

  async function fetchUserAchievements(username: string) {
    try {
      isLoading.value = true
      error.value = null
      achievements.value = await httpBackend<Success[]>(`/api/profile/${username}/userSuccess`)
    } catch (err) {
      error.value =
        "Erreur lors de la récupération des succès de l'utilisateur. Veuillez réessayer plus tard."
    } finally {
      isLoading.value = false
    }
  }

  function addNewAchievement(achievement: Success) {
    if (!achievements.value.find((a) => a.name === achievement.name)) {
      achievements.value.push(achievement)
    }
  }

  return {
    achievements,
    isLoading,
    error,
    fetchUserAchievements,
    addNewAchievement
  }
})
