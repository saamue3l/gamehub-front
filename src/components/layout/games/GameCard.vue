<script setup lang="ts">
import type { Game } from '@/types/Game'
import { getImageSize, IGDBImageSizes } from '@/lib/igdbImages'

defineProps<{
  game: Game
  isSelected: boolean
}>()
</script>

<template>
  <article
    :class="[
      'border flex flex-col justify-between items-center w-[12%] min-w-[12%] cursor-pointer p-1.5 rounded',
      { 'bg-primary': isSelected }
    ]"
  >
    <img class="w-[200px]" :src="getImageSize(game.coverUrl, IGDBImageSizes.COVER_BIG)" />
    <p>{{ game.name }}</p>
  </article>
</template>

<style scoped></style>
