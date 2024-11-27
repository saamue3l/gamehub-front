<script setup lang="ts">
import { Calendar, MessageSquare, Send, ThumbsUp, Trophy, Users } from 'lucide-vue-next'
import { ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import type { UserStats } from '@/types/UserStats'
import { useAchievementsStore } from '@/store/achievementsStore'
import { httpBackend } from '@/lib/utils'
import LoadingSpinner from '@/components/ui/feedback/spinner/LoadingSpinner.vue'
import StatItem from '@/components/profile/UserStats/StatItem.vue'
import { useProfileStore } from '@/store/profileStore'

const profileStore = useProfileStore()

const achievementsStore = useAchievementsStore()
const isLoading = ref(true)
const errorMessage = ref<string | null>(null)
const route = useRoute()
const userStats = ref<UserStats>({
  success: 0,
  createdEvents: 0,
  joinedEvents: 0,
  topic: 0,
  post: 0,
  reaction: 0
})

const fetchUserInfo = async () => {
  try {
    isLoading.value = true
    userStats.value = await httpBackend<UserStats>(
      `/api/profile/${route.params.username}/userStats`
    )
  } catch (err) {
    errorMessage.value =
      "Erreur lors de la récupération des statistiques de l'utilisateur. Veuillez réessayer plus tard."
  } finally {
    isLoading.value = false
  }
}

watchEffect(() => {
  if (route.params.username) {
    fetchUserInfo()
  }
})
</script>

<template>
  <div v-if="isLoading" class="w-full flex justify-center">
    <LoadingSpinner size="xl"></LoadingSpinner>
  </div>
  <div v-else-if="errorMessage" class="text-red-500 text-center py-4">
    {{ errorMessage }}
  </div>
  <div v-else class="rounded-lg border py-3 mb-4">
    <div class="grid grid-cols-3 md:grid-cols-6 gap-y-4 divide-x divide-gray-800">
      <StatItem
        :icon="Trophy"
        :value="
          profileStore.isOwnProfile ? achievementsStore.achievements.length : userStats.success
        "
        label="Succès"
      />
      <StatItem :icon="Calendar" :value="userStats.createdEvents" label="Évènements créés" />
      <StatItem :icon="Users" :value="userStats.joinedEvents" label="Évènements rejoints" />
      <StatItem :icon="MessageSquare" :value="userStats.topic" label="Sujets" />
      <StatItem :icon="Send" :value="userStats.post" label="Messages" />
      <StatItem :icon="ThumbsUp" :value="userStats.reaction" label="Réactions" />
    </div>
  </div>
</template>

<style scoped>
@media (max-width: 768px) {
  .grid > div:nth-child(-n + 3) {
    border-bottom: 1px solid rgb(31 41 55);
  }
}
</style>
