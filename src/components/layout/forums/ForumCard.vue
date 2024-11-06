<!-- Petite carte présentant les informations principale d'un évènement de jeu-->

<script setup lang="ts">
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import GameCover from '@/components/layout/games/GameCover.vue'
import UsersIcon from '@/components/icons/usersIcon.vue'
import EventInfo from '@/components/layout/events/EventInfo.vue'
import { Calendar as CalendarIcon } from 'lucide-vue-next'
import JoinEventButton from '@/components/layout/events/JoinEventButton.vue'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import type { Forum } from '@/types/Forum'

defineProps<{
  forum: Forum
}>()
</script>

<template>
  <Card class="self-start">
    <CardHeader>
      <CardTitle>{{ forum.name }}</CardTitle>
    </CardHeader>
  </Card>
</template>

<style scoped></style>
