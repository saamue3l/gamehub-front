<script setup lang="ts">
import TitleContainer from '@/components/profile/TitleContainer.vue'
import AchievementItem from '@/components/profile/Achievements/AchievementItem.vue'
import LoadingSpinner from '@/components/ui/feedback/spinner/LoadingSpinner.vue'
import { useRoute } from 'vue-router'
import { useAchievementsStore } from '@/store/achievementsStore'
import { watchEffect } from 'vue'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useProfileStore } from '@/store/profileStore'
import { Button } from '@/components/ui/button'
import AllAchievementsDialog from '@/components/profile/Achievements/AllAchievementsDialog.vue'
const profileStore = useProfileStore()

const route = useRoute()
const achievementsStore = useAchievementsStore()

watchEffect(() => {
  if (route.params.username) {
    achievementsStore.fetchUserAchievements(route.params.username as string)
  }
})
</script>

<template>
  <TitleContainer title="Succès">
    <div v-if="achievementsStore.isLoading" class="w-full flex justify-center">
      <LoadingSpinner size="xl"></LoadingSpinner>
    </div>
    <div v-else-if="achievementsStore.error" class="text-red-500 text-center py-4">
      {{ achievementsStore.error }}
    </div>
    <div v-else>
      <ScrollArea class="h-60">
        <div
          v-for="success in achievementsStore.achievements"
          :key="success.id"
          class="flex flex-col p-2 space-y-2"
        >
          <AchievementItem :title="success.name" :description="success.description" />
        </div>
        <div v-if="profileStore.isOwnProfile" class="flex justify-center items-center p-2">
          <AllAchievementsDialog />
        </div>
      </ScrollArea>
    </div>
  </TitleContainer>
</template>
