<script setup lang="ts">
import SearchBar from '@/components/ui/inputs/searchbar/SearchBar.vue'
import BasePage from '@/components/layout/BasePage.vue'
import DatePicker from '@/components/ui/inputs/datePicker/DatePicker.vue'
import { Button } from '@/components/ui/button'
import EventCard from '@/components/layout/events/EventCard.vue'
import { httpBackend } from '@/lib/utils'
import { ref, onMounted } from 'vue'
import LoadingSpinner from '@/components/ui/feedback/spinner/LoadingSpinner.vue'

const events = ref<Event[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    isLoading.value = true
    events.value = await httpBackend<Event[]>('/api/event/allEvents')
  } catch (error) {
    error.value =
      "Nous n'avons pas réussi a télécharger les évènements. Veuillez réessayer plus tard."
    console.error('Error fetching the events:', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <BasePage title="Évènements">
    <header class="w-full flex justify-between">
      <article class="flex gap-3 float-left">
        <SearchBar placeholder="Rechercher par jeu"></SearchBar>
        <DatePicker></DatePicker>
      </article>
      <article class="flex gap-3 float-right">
        <Button>{{ 'Créer un évènement'.toUpperCase() }}</Button>
      </article>
    </header>

    <!-- Liste des évènements -->

    <section class="w-full border">
      <!-- while fetching -->
      <div v-if="isLoading" class="w-full flex justify-center">
        <LoadingSpinner size="xl"></LoadingSpinner>
      </div>

      <!-- If error while fetching -->
      <div v-else-if="error" class="text-red-500 text-center">
        <p>{{ error }}</p>
      </div>

      <!-- When fetched -->
      <EventCard v-else v-for="event in events" :event="event" :key="event.id"></EventCard>
    </section>
  </BasePage>
</template>

<style scoped>

</style>