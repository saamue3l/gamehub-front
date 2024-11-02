<template>
  <div>
    <p class="text-custom-white text-sm font-bold pb-1 pl-2 uppercase">Jeux favoris</p>
    <div class="flex-col space-y-3 border border-custom-white rounded-lg p-3">
      <AddFavoriteGameDialog v-if="profileStore.isOwnProfile && !isLoading" />

      <div v-if="isLoading" class="w-full flex justify-center">
        <LoadingSpinner size="xl"></LoadingSpinner>
      </div>

      <div v-else-if="error" class="text-red-500 text-center">
        <p>{{ error }}</p>
      </div>

      <div v-else-if="!favoriteGames.length" class="text-center py-4 text-custom-white">
        <p>Aucun jeu favori ajouté</p>
      </div>

      <template v-else>
        <template v-for="(favoriteGame, index) in favoriteGames" :key="favoriteGame.id">
          <FavoriteGameItem
            :favorite-game-id="favoriteGame.id"
            :image-url="favoriteGame.game.cover"
            :game-name="favoriteGame.game.name"
            :skill-id="favoriteGame.skill.id"
            :level="favoriteGame.skill.label"
            :description="favoriteGame.description"
          />
          <Separator v-if="index < favoriteGames.length - 1" class="my-5" />
        </template>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useProfileStore } from '@/store/profileStore'
import { useFavoriteGamesStore } from '@/store/favoriteGamesStore'
import { Separator } from '@/components/ui/Separator'
import AddFavoriteGameDialog from '@/components/profile/FavoriteGames/AddFavoriteGameDialog.vue'
import FavoriteGameItem from '@/components/profile/FavoriteGames/FavoriteGameItem.vue'
import LoadingSpinner from '@/components/ui/feedback/spinner/LoadingSpinner.vue'

const route = useRoute()
const profileStore = useProfileStore()
const favoriteGamesStore = useFavoriteGamesStore()
const { favoriteGames, isLoading, error } = storeToRefs(favoriteGamesStore)

watchEffect(() => {
  if (route.params.username) {
    favoriteGamesStore.fetchFavoriteGames(route.params.username as string)
  }
})
</script>
