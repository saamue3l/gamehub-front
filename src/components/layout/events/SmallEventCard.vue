<script setup lang="ts">
import { Event } from '@/types/Event'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import GameCover from '@/components/layout/games/GameCover.vue'
import { IGDBImageSizes } from '@/lib/igdbImages'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import UsersIcon from '@/components/icons/usersIcon.vue'
import EventInfo from '@/components/layout/events/EventInfo.vue'
import EventCardInfos from '@/components/layout/events/EventCardInfos.vue'

defineProps<{
  event: Event
}>()
</script>

<template>
  <Card>
    <CardHeader class="flex flex-row justify-between">
      <p class="text font-bold">{{ event.name }}</p>
      <GameCover
        :game="event.game"
        :image-size="IGDBImageSizes.MICRO"
        class="inline-block self-stretch max-h-full flex-shrink"
      />
    </CardHeader>
    <CardContent>
      <!--     Event infos     -->
      <EventCardInfos :event="event" />
    </CardContent>
  </Card>
</template>

<style scoped></style>
