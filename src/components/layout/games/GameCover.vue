<script setup lang="ts">
import type { Game } from '@/types/Game'
import { getImageSize, IGDBImageSizes } from '@/lib/igdbImages'
import { type HTMLAttributes, reactive, ref } from 'vue'

const props = defineProps<{
  game: Game
  imageSize: IGDBImageSizes
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <img
    :class="props.class"
    :src="getImageSize(game.coverUrl, imageSize)"
    :alt="'Jackette du jeu ' + game.name"
  />
</template>

<style scoped></style>
