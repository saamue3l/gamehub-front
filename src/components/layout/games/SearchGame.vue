<script setup lang="ts">
import Header from '@/components/layout/header/Header.vue'
import SearchBar from '@/components/ui/inputs/searchbar/SearchBar.vue'
import { httpBackend } from '@/lib/utils'
import { onMounted, type Ref, ref } from 'vue'
import type { Game } from '@/types/Game'
import GameCard from '@/components/layout/games/gameCard/GameCard.vue'
import { Skeleton } from '@/components/ui/skeleton'

const emit = defineEmits<{
  (e: 'select-game', game: Game | null): void // Game when the user selects a game and null when he deselects a game
}>()

const games: Ref = ref<Game[]>([]) // List of games based on the user's search
const isLoading: Ref = ref(false) // Are we waiting for a response from the back-end ?
const errorMessage: Ref = ref<string | null>(null) // Is there an error while fetching the back-end ?
const selectedGame: Ref = defineModel<Game | null>({ default: null }) // The game the user selected
const gameSearch: Ref = ref('') // the search the user have made / The input value


async function searchGame() {
  let search = gameSearch.value

  if (selectedGame.value != null) {
    // If we sent a selected game right before, we send that the user unselected a game
    emit('select-game', null)
  }
  selectedGame.value = null

  if (search == '') {
    // Reset if the user erased his search
    games.value = []
    return
  }

  try {
    isLoading.value = true
    games.value = await httpBackend<Game[]>('/api/game/searchGames', 'POST', { search: search })
    if (games.value.length == 0) {
      // Error message if back-end returned no results
      errorMessage.value = 'Aucun jeu trouvé'
      return
    } else {
      errorMessage.value = '' // Reset the "error"
    }
  } catch (error) {
    errorMessage.value =
      "Nous n'avons pas réussi a télécharger les jeux. Veuillez réessayer plus tard."
    console.error('Error fetching the games:', error)
  } finally {
    isLoading.value = false // Stop the loading
  }
}


function setGame(game: Game) {
  emit('select-game', game)
  selectedGame.value = game
  gameSearch.value = game.name // Set the input value to the name of the game
  games.value = [game] // Remove every other games
  console.info('User selected the game named ', game.name)
}

onMounted(() => {
  if (selectedGame.value != null) {
    setGame(selectedGame.value)
  }
})
</script>

<template>
  <section id="searchGame">
    <header>
      <SearchBar
        placeholder="Rechercher un jeu"
        :autocomplete="false"
        v-model="gameSearch"
        @input="searchGame"
      ></SearchBar>
    </header>
    <section
      ref="gamePreviewContainer"
      class="flex justify-start overflow-auto gap-3 flex-grow flex-shrink basis-0 py-3"
    >
      <!-- while fetching -->
      <Skeleton
        v-if="isLoading"
        class="w-[150px] min-w-[150px] h-[243px]"
        v-for="i in Math.floor(Math.random() * 3) + 2"
      ></Skeleton>

      <!-- If error while fetching -->
      <div v-else-if="errorMessage" class="text-red-500 text-center">
        <p>{{ errorMessage }}</p>
      </div>

      <GameCard
        v-else
        v-for="game in games"
        v-key="game.id"
        :game="game"
        :is-selected="selectedGame?.id === game.id"
        @click="setGame(game)"
      ></GameCard>
    </section>
  </section>
</template>

<style scoped></style>
