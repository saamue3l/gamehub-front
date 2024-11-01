import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { FavoriteGame, FavoriteGameAdd, FavoriteGameUpdate } from '@/types/FavoriteGame'
import { httpBackend } from '@/lib/utils'

export const useFavoriteGamesStore = defineStore('favoriteGames', () => {
  const favoriteGames = ref<FavoriteGame[]>([])
  const isLoading = ref(true)
  const error = ref<string | null>(null)

  const fetchFavoriteGames = async (username: string) => {
    try {
      isLoading.value = true
      error.value = null
      favoriteGames.value = await httpBackend<FavoriteGame[]>(
        `/api/profile/${username}/favoriteGames`
      )
    } catch (err) {
      error.value = 'Erreur lors de la récupération des jeux favoris'
      console.error('Error fetching favorite games:', err)
    } finally {
      isLoading.value = false
    }
  }

  const addFavoriteGame = async (newGame: FavoriteGame) => {
    try {
      const gameToAdd: FavoriteGameAdd = {
        gameId: newGame.game.id,
        skillId: newGame.skill.id,
        description: newGame.description
      }

      const response = await httpBackend<{ id: number }>(
        '/api/profile/addFavoriteGame',
        'POST',
        gameToAdd
      )

      const completeGame: FavoriteGame = {
        id: response,
        description: newGame.description,
        game: newGame.game,
        skill: newGame.skill
      }

      favoriteGames.value = [completeGame, ...favoriteGames.value]
    } catch (error) {
      throw error
    }
  }

  const updateFavoriteGame = async (updates: FavoriteGameUpdate) => {
    try {
      console.log('updates', updates)

      await httpBackend<void>('/api/profile/updateFavoriteGame', 'PUT', updates)

      const index = favoriteGames.value.findIndex((game) => game.id === updates.id)
      if (index !== -1) {
        favoriteGames.value[index] = {
          ...favoriteGames.value[index],
          description: updates.description,
          skill: updates.skill
        }
      }
    } catch (error) {
      throw error
    }
  }

  const deleteFavoriteGame = async (favoriteGameId: number) => {
    try {
      await httpBackend<void>('/api/profile/deleteFavoriteGame', 'DELETE', { favoriteGameId })

      favoriteGames.value = favoriteGames.value.filter((game) => game.id !== favoriteGameId)
    } catch (error) {
      throw error
    }
  }

  return {
    favoriteGames,
    isLoading,
    error,
    fetchFavoriteGames,
    addFavoriteGame,
    updateFavoriteGame,
    deleteFavoriteGame
  }
})
