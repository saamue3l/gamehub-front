<script setup lang="ts">
import type { Game } from '@/types/Game'
import { getImageSize, IGDBImageSizes } from '@/lib/igdbImages'
import { Card } from '@/components/ui/card'
import { gameCardVariants, type GameCardVariants } from '@/components/layout/games/gameCard/index'
import { cn } from '@/lib/utils'
import { GameCardImage } from '@/components/layout/games/gameCard/gameCardImage'

defineProps<{
  game: Game
  isSelected: boolean
  direction?: GameCardVariants['direction']
}>()
</script>

<template>
  <Card :class="[cn(gameCardVariants({ direction })), { 'bg-primary': isSelected }]">
    <GameCardImage :game="game" :direction="direction" />
    <p :class="{ 'text-right': direction == 'horizontal' }">{{ game.name }}</p>
  </Card>
</template>

<style scoped></style>
