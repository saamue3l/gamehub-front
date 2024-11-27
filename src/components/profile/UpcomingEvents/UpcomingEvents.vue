<script setup lang="ts">
import TitleContainer from '@/components/profile/TitleContainer.vue'
import LoadingSpinner from '@/components/ui/feedback/spinner/LoadingSpinner.vue'
import { onMounted, ref } from 'vue'
import type { Event } from '@/types/Event'
import { httpBackend } from '@/lib/utils'
import SmallEventCard from '@/components/layout/events/SmallEventCard.vue'
import TextLink from '@/components/ui/link/TextLink.vue'
import { useProfileStore } from '@/store/profileStore'
import { Button } from '@/components/ui/button'

const profileStore = useProfileStore()

const isLoading = ref(false)
const errorMessage = ref<string | null>(null)
const userSubrscibedEvents = ref<Event[] | null>(null)
const MAX_EVENTS_TO_SHOW = 3

const fetchUserSubscribedEvents = async () => {
  isLoading.value = true
  try {
    const response = await httpBackend<Event[]>('/api/event/getUserSubscribedEvents', 'GET')
    userSubrscibedEvents.value = response.sort((a, b) => {
      return new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()
    })
    if (userSubrscibedEvents.value.length === 0) {
      errorMessage.value = 'Aucun évènement inscrit à venir'
    }
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchUserSubscribedEvents()
})
</script>

<template>
  <TitleContainer title="Évènements inscrits à venir" v-if="profileStore.isOwnProfile">
    <div v-if="isLoading" class="w-full flex justify-center">
      <LoadingSpinner size="xl"></LoadingSpinner>
    </div>

    <div v-else-if="errorMessage" class="p-2 flex flex-col items-center justify-center gap-2">
      <div class="flex flex-col flex-1 justify-center">
        <div class="flex items-center gap-2">
          <p class="text-foreground font-bold text-sm">Aucun événement à venir</p>
        </div>
        <p class="text-foreground text-xs">Vous n'êtes inscrit à aucun événement pour le moment</p>
      </div>

      <Button class="w-full" variant="secondary">Parcourir les événements</Button>
    </div>

    <div v-else-if="userSubrscibedEvents" class="m-2 flex flex-col justify-start gap-1.5">
      <SmallEventCard
        v-for="event in userSubrscibedEvents.slice(0, MAX_EVENTS_TO_SHOW)"
        :event="event"
      ></SmallEventCard>
      <router-link to="/events?joinedFilter=true" as-child>
        <p v-if="userSubrscibedEvents.length > MAX_EVENTS_TO_SHOW">
          + {{ userSubrscibedEvents.length - MAX_EVENTS_TO_SHOW }} autre(s) évènement(s)...
        </p>

        <Button class="w-full mt-1" variant="secondary">Voir tous mes événements</Button>
      </router-link>
    </div>
  </TitleContainer>
</template>

<style scoped></style>
