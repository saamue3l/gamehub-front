<!-- Petite carte présentant les informations principale d'un évènement de jeu-->

<script setup lang="ts">
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Event } from '@/types/Event'
import GameCover from '@/components/layout/games/GameCover.vue'
import { IGDBImageSizes } from '@/lib/igdbImages'
import { onMounted, ref } from 'vue'
import UsersIcon from '@/components/icons/usersIcon.vue'
import EventInfo from '@/components/layout/events/EventInfo.vue'
import { Calendar as CalendarIcon } from 'lucide-vue-next'
import JoinEventButton from '@/components/layout/events/JoinEventButton.vue'

const imageSize = ref<IGDBImageSizes>(IGDBImageSizes.COVER_BIG)

onMounted(() => {
  function setImageSize() {
    imageSize.value =
      window.innerWidth > 1024 ? IGDBImageSizes.COVER_BIG : IGDBImageSizes.SCREENSHOT_MEDIUM
  }
  window.addEventListener('resize', setImageSize)
  setImageSize()
})

defineProps<{
  event: Event
}>()
</script>

<template>
  <Card class="self-start">
    <div class="w-full grid lg:grid-cols-[minmax(0,.75fr)_minmax(0,1fr)] grid-cols-1">
      <!--   Game Cover   -->
      <section class="row-span-3 lg:rounded-l lg:rounded-tr-none rounded-t">
        <GameCover
          class="lg:rounded-l lg:rounded-tr-none rounded-t max-w-full"
          :game="event.game"
          :image-size="imageSize"
        ></GameCover>
      </section>

      <!--   Event info   -->
      <section class="row-span-3 flex flex-col">
        <CardHeader>
          <CardTitle>{{ event.name }}</CardTitle>
        </CardHeader>
        <CardContent class="flex flex-col justify-start items-start gap-1.5 flex-1">
          <!--     Event infos     -->
          <section class="flex justify-start gap-5 flex-wrap">
            <EventInfo :text="`${event.participants.length} / ${event.maxPlayers}`">
              <UsersIcon class="h-4 w-4" />
            </EventInfo>

            <EventInfo :text="new Date(Date.parse(event.eventDate)).toLocaleDateString('fr-FR')">
              <CalendarIcon class="h-4 w-4" />
            </EventInfo>
          </section>

          <!--     Event description     -->
          <p>
            {{ event.description }}
          </p>
        </CardContent>

        <CardFooter class="flex justify-end">
          <JoinEventButton :event="event" />
        </CardFooter>
      </section>
    </div>
  </Card>
</template>

<style scoped></style>
