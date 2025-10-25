<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogDescription,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { useAchievementsStore } from '@/store/achievementsStore'
import { httpBackend } from '@/lib/utils'
import type { Success } from '@/types/Success'
import LoadingSpinner from '@/components/ui/feedback/spinner/LoadingSpinner.vue'
import { ScrollArea } from '@/components/ui/scroll-area'
import AchievementItem from '@/components/profile/Achievements/AchievementItem.vue'

const allAchievements = ref<Success[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)
const isOpen = ref(false)

const userAchievementsStore = useAchievementsStore()

async function fetchAllAchievements() {
  try {
    isLoading.value = true
    error.value = null
    allAchievements.value = await httpBackend<Success[]>('/api/utils/allSuccess')
  } catch (err) {
    error.value = 'Erreur lors de la récupération des succès. Veuillez réessayer plus tard.'
  } finally {
    isLoading.value = false
  }
}

const isAchievementUnlocked = (achievement: Success) => {
  return userAchievementsStore.achievements.some((a) => a.name === achievement.name)
}

onMounted(() => {
  fetchAllAchievements()
})
</script>

<template>
  <Dialog v-model:open="isOpen">
    <DialogTrigger as-child>
      <Button class="w-full" variant="secondary">Voir tous les succès</Button>
    </DialogTrigger>

    <DialogContent class="sm:max-w-[425px] grid-rows-[auto_minmax(0,1fr)_auto] p-0 max-h-[90dvh]">
      <DialogHeader class="p-6 pb-0">
        <DialogTitle>Liste des succès</DialogTitle>
        <DialogDescription>
          Liste de tous les succès disponibles sur la plateforme
        </DialogDescription>
      </DialogHeader>

      <div class="py-4 px-6">
        <div v-if="isLoading" class="w-full flex justify-center">
          <LoadingSpinner size="xl" />
        </div>

        <div v-else-if="error" class="text-red-500 text-center py-4">
          {{ error }}
        </div>

        <ScrollArea v-else class="h-[60vh]">
          <div
            v-for="achievement in allAchievements"
            :key="achievement.id"
            class="flex flex-col p-2 space-y-2"
          >
            <AchievementItem
              :title="achievement.name"
              :description="achievement.description"
              :is-unlocked="isAchievementUnlocked(achievement)"
              :show-unlock-state="true"
            />
          </div>
        </ScrollArea>
      </div>

      <DialogFooter class="p-6 pt-0">
        <Button type="button" variant="secondary" @click="isOpen = false"> Fermer </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
