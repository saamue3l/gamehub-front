<script setup lang="ts">
import BasePage from '@/components/layout/BasePage.vue'
import DatePicker from '@/components/ui/inputs/datePicker/DatePicker.vue'
import { Button } from '@/components/ui/button'
import EventCard from '@/components/layout/events/EventCard.vue'
import { httpBackend } from '@/lib/utils'
import { ref, onMounted } from 'vue'
import SearchGamePopover from '@/components/layout/games/SearchGamePopover.vue'
import { Skeleton } from '@/components/ui/skeleton'

const events = ref<Event[]>([])
const isLoading = ref(true)
const errorMessage = ref<string | null>(null)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    isLoading.value = true
    events.value = await httpBackend<Event[]>('/api/event/allEvents')
  } catch (error) {
    errorMessage.value =
      "Nous n'avons pas réussi a télécharger les évènements. Veuillez réessayer plus tard."
    console.error('Error fetching the events:', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <BasePage title="Évènements">
    <header class="w-full flex justify-between flex-wrap gap-3 max-w-full">
      <article class="flex gap-3 float-left flex-wrap">
        <SearchGamePopover></SearchGamePopover>
        <DatePicker></DatePicker>
      </article>
      <article class="flex gap-3 float-right">
        <Button>{{ 'Créer un évènement'.toUpperCase() }}</Button>
      </article>
    </header>

    <!-- Liste des évènements -->
    <section
      class="w-full border p-6 grid gap-3 justify-around items-start lg:grid-cols-[repeat(auto-fill,minmax(400px,1fr))] grid-cols-[repeat(auto-fill,1fr)]"
    >
      <!-- while fetching -->
      <Skeleton
        v-if="isLoading"
        class="self-start h-[300px] w-[50%]]"
        v-for="i in (Math.floor(Math.random() * 3) + 1) * 2"
      ></Skeleton>

      <!-- If error while fetching -->
      <div v-else-if="errorMessage" class="text-red-500 text-center">
        <p>{{ errorMessage }}</p>
      </div>

      <!-- When fetched -->
      <EventCard v-else v-for="event in events" :event="event" :key="event.id"></EventCard>
    </section>
  </BasePage>
</template>

<style scoped></style>
