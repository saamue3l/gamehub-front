<script setup lang="ts">
import type { Game } from '@/types/Game'
import { getImageSize, IGDBImageSizes } from '@/lib/igdbImages'
import { type HTMLAttributes, reactive, ref } from 'vue'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

const props = defineProps<{
  game: Game
  imageSize: IGDBImageSizes
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger as-child>
        <img
          :class="props.class"
          :src="getImageSize(game.coverUrl, imageSize)"
          :alt="'Jackette du jeu ' + game.name"
        />
      </TooltipTrigger>
      <TooltipContent align="center"
        ><p>{{ game.name }}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>

<style scoped></style>
