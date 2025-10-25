import { defineStore } from 'pinia'
import { ref } from 'vue'
import { httpBackend } from '@/lib/utils'

export const useReactionTypesStore = defineStore('reactionTypes', () => {
  const reactionTypes = ref<string[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const localStorageKey = 'allReactionType'

  const fetchAllPossibleReactions = (): void => {
    const allPossibleReactions = getCachedPossibleReactionsOrCache()
    if (allPossibleReactions) {
      // Assign if local storage is not empty
      reactionTypes.value = allPossibleReactions
    }
  }

  const getCachedPossibleReactionsOrCache = (): string[] | undefined => {
    let allPossibleReactions: any = window.localStorage.getItem(localStorageKey)
    if (allPossibleReactions as string) {
      allPossibleReactions = JSON.parse(allPossibleReactions)
      return allPossibleReactions
    } else {
      if (!isLoading.value) {
        fetchReactionTypes()
      }
      return undefined
    }
  }

  const fetchReactionTypes = (): void => {
    try {
      isLoading.value = true
      error.value = null
      httpBackend<string[]>('/api/forums/getAllReactionTypes', 'GET').then((response) => {
        reactionTypes.value = response
        window.localStorage.setItem(localStorageKey, JSON.stringify(response))
        isLoading.value = false
      })
    } catch (err) {
      error.value = 'Erreur lors de la récupération des types de réaction'
      console.error('Error fetching reactionTypes:', err)
      isLoading.value = false
    }
  }

  return {
    reactionTypes,
    isLoading,
    error,
    fetchReactionTypes,
    fetchAllPossibleReactions
  }
})
