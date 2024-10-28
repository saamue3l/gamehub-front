<script setup lang="ts">
import type { Game } from '@/types/Game'
import {
  gameCardImageVariants,
  type GameCardImageVariants
} from '@/components/layout/games/gameCard/gameCardImage'
import { getImageSize, IGDBImageSizes } from '@/lib/igdbImages'
import { cn } from '@/lib/utils'
import { type HTMLAttributes, reactive, ref } from 'vue'

const props = defineProps<{
  game: Game
  class?: HTMLAttributes['class']
  direction?: GameCardImageVariants['direction']
}>()

const imageSize: ref = ref<IGDBImageSizes>(
  props.direction == 'horizontal' ? IGDBImageSizes.THUMBNAIL : IGDBImageSizes.COVER_BIG
)
</script>

<template>
  <img
    :class="cn(gameCardImageVariants({ direction }), props.class)"
    :src="getImageSize(game.coverUrl, imageSize)"
    :alt="'Jackette du jeu ' + game.name"
  />
</template>

<style scoped></style>
