<script setup lang="ts">
import TitleContainer from '@/components/profile/TitleContainer.vue'
import LoadingSpinner from '@/components/ui/feedback/spinner/LoadingSpinner.vue'
import { onMounted, ref } from 'vue'
import type { Event } from '@/types/Event'
import { httpBackend } from '@/lib/utils'
import SmallEventCard from '@/components/layout/events/SmallEventCard.vue'
import TextLink from '@/components/ui/link/TextLink.vue'
import { useProfileStore } from '@/store/profileStore'

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

    <div v-else-if="errorMessage" class="text-red-500 text-center">
      <p>{{ errorMessage }}</p>
    </div>

    <div v-else-if="userSubrscibedEvents" class="m-2 flex flex-col justify-start gap-1.5">
      <SmallEventCard
        v-for="event in userSubrscibedEvents.slice(0, MAX_EVENTS_TO_SHOW)"
        :event="event"
      ></SmallEventCard>
      <router-link to="/events?joinedFilter=true" as-child>
        <TextLink v-if="userSubrscibedEvents.length > MAX_EVENTS_TO_SHOW">
          + {{ userSubrscibedEvents.length - MAX_EVENTS_TO_SHOW }} autre(s) évènement(s)...
        </TextLink>
        <TextLink v-else>Voir tous les évènements inscrits</TextLink>
      </router-link>
    </div>
  </TitleContainer>
</template>

<style scoped></style>
