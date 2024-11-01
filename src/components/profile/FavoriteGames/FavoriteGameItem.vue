<template>
  <div class="flex justify-start items-start">
    <img
      :src="getImageSize(imageUrl, imageSize)"
      alt="game"
      class="w-1/5 h-auto object-contain border-custom-background rounded-lg"
    />
    <div class="flex flex-col justify-start space-y-2 pl-2">
      <div class="flex items-center">
        <p class="text-foreground font-bold">{{ gameName }}</p>
        <EditFavoriteGameDialog
          v-if="profileStore.isOwnProfile"
          :favorite-game-id="favoriteGameId"
          :game-name="gameName"
          :image-url="imageUrl"
          :skill-id="skillId"
          :description="description"
        />
      </div>
      <div class="flex mb-2">
        <Badge variant="outline">
          {{ level }}
        </Badge>
      </div>
      <p class="text-custom-white text-xs">{{ description }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps<{
  favoriteGameId: number
  imageUrl: string
  gameName: string
  skillId: number
  level: string
  description: string
}>()

import { Badge } from '@/components/ui/badge'

import { ref } from 'vue'

import { useProfileStore } from '@/store/profileStore'
import { getImageSize, IGDBImageSizes } from '@/lib/igdbImages'
import EditFavoriteGameDialog from '@/components/profile/FavoriteGames/EditFavoriteGameDialog.vue'

const profileStore = useProfileStore()

const imageSize: ref = ref<IGDBImageSizes>(
  props.direction == 'horizontal' ? IGDBImageSizes.THUMBNAIL : IGDBImageSizes.COVER_BIG
)
</script>
