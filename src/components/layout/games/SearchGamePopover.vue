<script setup lang="ts">
import Header from '@/components/layout/header/Header.vue'
import SearchBar from '@/components/ui/inputs/searchbar/SearchBar.vue'
import { httpBackend } from '@/lib/utils'
import { computed, ref, useTemplateRef, watch } from 'vue'
import type { Game } from '@/types/Game'
import LoadingSpinner from '@/components/ui/feedback/spinner/LoadingSpinner.vue'
import GameCard from '@/components/layout/games/gameCard/GameCard.vue'
import { nativeEnum } from 'zod'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollAreaViewport } from 'radix-vue'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { rand } from '@vueuse/core'

const props = defineProps<{
  excludeFavorites?: boolean
}>()

const excludeFavorites = computed(() => props.excludeFavorites ?? false)

const emit = defineEmits<{
  (e: 'select-game', game: Game | null): void // Game when the user selects a game and null when he deselects a game
}>()

const games = ref<Game[]>([]) // List of games based on the user's search
const isLoading = ref(false) // Are we waiting for a response from the back-end ?
const errorMessage = ref<string | null>(null) // Is there an error while fetching the back-end ?
const selectedGame = ref<Game | null>(null) // The game the user selected
const gameSearch = ref('') // the search the user have made / The input value

/**
 * Display the results of a search for a game
 */
async function searchGame() {
  let search = gameSearch.value

  if (selectedGame.value != null) {
    emit('select-game', null)
  }
  selectedGame.value = null

  if (search == '') {
    games.value = []
    return
  }

  try {
    isLoading.value = true
    const endpoint = excludeFavorites.value
      ? '/api/game/searchGamesWithoutFavorites'
      : '/api/game/searchGames'
    games.value = await httpBackend<Game[]>(endpoint, 'POST', { search: search })
    if (games.value.length == 0) {
      errorMessage.value = 'Aucun jeu trouvé'
      return
    } else {
      errorMessage.value = ''
    }
  } catch (error) {
    errorMessage.value =
      "Nous n'avons pas réussi a télécharger les jeux. Veuillez réessayer plus tard."
    console.error('Error fetching the games:', error)
  } finally {
    isLoading.value = false
  }
}

/**
 * Set the given game as the selected one
 * @param game The game to set as selected
 */
function setGame(game: Game) {
  emit('select-game', game)
  selectedGame.value = game
  gameSearch.value = game.name // Set the input value to the name of the game
  games.value = [game] // Remove every other games
  console.info('User selected the game named ', game.name)
}
</script>

<template>
  <Popover>
    <PopoverTrigger>
      <SearchBar
        placeholder="Rechercher un jeu"
        :autocomplete="false"
        v-model="gameSearch"
        @input="searchGame"
      ></SearchBar>
    </PopoverTrigger>
    <PopoverContent>
      <section
        ref="gamePreviewContainer"
        class="flex flex-col justify-start overflow-auto gap-3 flex-grow max-h-[50vh]"
      >
        <!-- while fetching -->
        <Skeleton
          v-if="isLoading"
          class="w-full h-[70px]"
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
          direction="horizontal"
        ></GameCard>
      </section>
    </PopoverContent>
  </Popover>
</template>

<style scoped></style>
