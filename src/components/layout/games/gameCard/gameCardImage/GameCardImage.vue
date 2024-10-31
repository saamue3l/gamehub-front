<script setup lang="ts">
import type { Game } from '@/types/Game'
import {
  gameCardImageVariants,
  type GameCardImageVariants
} from '@/components/layout/games/gameCard/gameCardImage'
import { getImageSize, IGDBImageSizes } from '@/lib/igdbImages'
import { cn } from '@/lib/utils'
import { type HTMLAttributes, reactive, ref } from 'vue'
import GameCover from '@/components/layout/games/GameCover.vue'

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
  <GameCover
    :game="props.game"
    :image-size="imageSize"
    :class="cn(gameCardImageVariants({ direction }), props.class)"
  ></GameCover>
</template>

<style scoped></style>
