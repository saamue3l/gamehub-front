<script setup lang="ts">
import type { Game } from '@/types/Game'
import { getImageSize, IGDBImageSizes } from '@/lib/igdbImages'
import { Card } from '@/components/ui/card'

defineProps<{
  game: Game
  isSelected: boolean
}>()
</script>

<template>
  <Card
    :class="[
      'flex flex-col justify-between items-center w-[12%] min-w-[12%] cursor-pointer p-1.5',
      { 'bg-primary': isSelected }
    ]"
  >
    <img class="w-[200px]" :src="getImageSize(game.coverUrl, IGDBImageSizes.COVER_BIG)" />
    <p>{{ game.name }}</p>
  </Card>
</template>

<style scoped></style>
