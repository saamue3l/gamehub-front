<script setup lang="ts">
import BasePage from '@/components/layout/BasePage.vue'
import EventCard from '@/components/layout/events/EventCard.vue'
import { httpBackend, toNativeDate } from '@/lib/utils'
import { onMounted, ref, watch } from 'vue'
import SearchGamePopover from '@/components/layout/games/SearchGamePopover.vue'
import { Skeleton } from '@/components/ui/skeleton'
import type { Game } from '@/types/Game'
import DateRangePicker from '@/components/ui/inputs/datePicker/DateRangePicker.vue'
import CreateEventButton from '@/components/layout/events/CreateEventButton.vue'
import type { DateRange } from 'radix-vue'
import { ArrowUpDown } from 'lucide-vue-next'
import ChevronDownIcon from '@/components/icons/chevronDownIcon.vue'
import SortSwitch from '@/components/ui/sortSwitch/SortSwitch.vue'

const events = ref<Event[]>([])
const isLoading = ref(true)
const errorMessage = ref<string | null>(null)
const selectedGame = ref<Game | null>(null)
const selectedDates = ref<DateRange | null>(null)
const descSort = ref<boolean>()

function sortEvents(): void {
  events.value.sort((a, b) => {
    if (descSort.value) {
      console.log(new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime())
      return new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime()
    } else {
      console.log(new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())

      return new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()
    }
  })
}

async function fetchEvents() {
  try {
    isLoading.value = true
    errorMessage.value = null

    // Create start and end dates for the selected day
    const parameters: Record<string, string | number> = {}
    if (selectedGame.value) {
      parameters.gameId = selectedGame.value.id
    }
    if (selectedDates.value && selectedDates.value['start'] && selectedDates.value['end']) {
      const convertedDateStart = toNativeDate(selectedDates.value['start'])
      const convertedDateEnd = toNativeDate(selectedDates.value['end'])
      const startDate = new Date(convertedDateStart.setHours(0, 0, 0, 0)).toISOString() // 00:00:00
      const endDate = new Date(convertedDateEnd.setHours(23, 59, 59, 999)).toISOString() // 23:59:59
      parameters.eventDateStart = startDate
      parameters.eventDateEnd = endDate
    }

    events.value = await httpBackend('/api/event/allEvents', 'POST', parameters)
    sortEvents()
    if (events.value.length == 0) {
      errorMessage.value = "Aucun évènement n'as été trouvé avec les paramètres donnés"
    }
  } catch (error) {
    errorMessage.value =
      "Nous n'avons pas réussi à télécharger les évènements. Veuillez réessayer plus tard."
    console.error('Error fetching the events:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchEvents)
watch(descSort, sortEvents)
</script>

<template>
  <BasePage title="Évènements">
    <header class="w-full flex justify-between flex-wrap gap-3 max-w-full">
      <article class="flex gap-3 float-left flex-wrap">
        <SearchGamePopover
          @select-game="
            (game) => {
              selectedGame = game
              fetchEvents()
            }
          "
        />
        <DateRangePicker
          @select-dates="
            (dates) => {
              selectedDates = dates
              fetchEvents()
            }
          "
        />
        <!--    Sort by Date    -->
        <SortSwitch v-model="descSort" placeholder="Trier par date" button-variant="outline" />
      </article>
      <article class="flex gap-3 float-right">
        <CreateEventButton @created-event="fetchEvents" />
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

<style scoped>
.grid-item {
  transition: all 500ms ease;
}

.grid-move {
  transform: scale(0.9);
}
</style>
