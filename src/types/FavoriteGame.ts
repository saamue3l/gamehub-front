import type { SkillType } from '@/types/SkillType'
import type { Game } from '@/types/Game'

export type FavoriteGame = {
  id?: number
  description: string
  game: Game
  skill: SkillType
}

export type FavoriteGameAdd = {
  gameId: number
  skillId: number
  description: string
}

export type FavoriteGameUpdate = {
  id: number
  description: string
  skill: SkillType
}
