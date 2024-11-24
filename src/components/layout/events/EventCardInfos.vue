<script setup lang="ts">
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import UsersIcon from '@/components/icons/usersIcon.vue'
import EventInfo from '@/components/layout/events/EventInfo.vue'
import { Calendar as CalendarIcon } from 'lucide-vue-next'

import { Event } from '@/types/Event'

defineProps<{
  event: Event
}>()
</script>

<template>
  <section class="flex justify-start gap-5 flex-wrap">
    <EventInfo :text="`${event.participants.length} / ${event.maxPlayers}`">
      <UsersIcon class="h-4 w-4" />
    </EventInfo>

    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger as-child>
          <EventInfo :text="new Date(Date.parse(event.eventDate)).toLocaleDateString()">
            <CalendarIcon class="h-4 w-4" />
          </EventInfo>
        </TooltipTrigger>
        <TooltipContent align="center" side="top"
          ><p>{{ new Date(Date.parse(event.eventDate)).toDateString() }}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </section>
</template>

<style scoped></style>
