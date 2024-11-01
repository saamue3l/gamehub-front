import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Username } from '@/types/Username'
import type { UsernameUpdate } from '@/types/Username'
import { httpBackend } from '@/lib/utils'
import { usePlatformStore } from '@/store/platformStore'

const cleanIconUrl = (url: string): string => {
  const lastSlashIndex = url.lastIndexOf('/')
  const cleanedUrl = url.substring(lastSlashIndex)
  return `/src/assets/platformIcons${cleanedUrl}`
}

export const useUserAliasStore = defineStore('userAlias', () => {
  const userAlias = ref<Username[]>([])
  const isLoading = ref(true)
  const error = ref<string | null>(null)

  const platformStore = usePlatformStore()

  const fetchUserAlias = async (username: string) => {
    try {
      isLoading.value = true
      error.value = null
      const response = await httpBackend<Username[]>(`/api/profile/${username}/userAlias`)

      userAlias.value = response.map((alias) => ({
        ...alias,
        platform: {
          ...alias.platform,
          logoUrl: cleanIconUrl(alias.platform.logoUrl)
        }
      }))
    } catch (err) {
      error.value = 'Erreur lors de la récupération des pseudos'
      console.error('Error fetching usernames:', err)
    } finally {
      isLoading.value = false
    }
  }

  const updateUserAlias = async (updates: UsernameUpdate[]) => {
    try {
      isLoading.value = true
      error.value = null

      if (platformStore.platforms.length === 0) {
        await platformStore.fetchPlatforms()
      }

      await httpBackend<void>('/api/profile/updateAlias', 'PUT', updates)

      userAlias.value = updates.map((update) => {
        const platform = platformStore.platforms.find((p) => p.id === update.platformId)

        if (!platform) {
          throw new Error(`Platform with id ${update.platformId} not found`)
        }

        return {
          username: update.username,
          platform: {
            ...platform,
            logoUrl: cleanIconUrl(platform.logoUrl)
          }
        }
      })
    } catch (err) {
      error.value = 'Erreur lors de la mise à jour des pseudos'
      console.error('Error updating usernames:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    userAlias,
    isLoading,
    error,
    fetchUserAlias,
    updateUserAlias
  }
})
