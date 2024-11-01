import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Platform } from '@/types/Platform'
import { httpBackend } from '@/lib/utils'

const cleanIconUrl = (url: string): string => {
  const lastSlashIndex = url.lastIndexOf('/')
  const cleanedUrl = url.substring(lastSlashIndex)
  return `/src/assets/platformIcons${cleanedUrl}`
}

export const usePlatformStore = defineStore('platform', () => {
  const platforms = ref<Platform[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchPlatforms = async () => {
    try {
      isLoading.value = true
      error.value = null
      const response = await httpBackend<Platform[]>('/api/utils/allPlatforms')

      platforms.value = response.map((platform) => ({
        ...platform,
        logoUrl: cleanIconUrl(platform.logoUrl)
      }))
    } catch (err) {
      error.value = 'Erreur lors de la récupération des plateformes'
      console.error('Error fetching platforms:', err)
    } finally {
      isLoading.value = false
    }
  }

  return {
    platforms,
    isLoading,
    error,
    fetchPlatforms
  }
})
