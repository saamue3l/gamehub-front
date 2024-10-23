import type { User } from '@/types/User'
import type { Game } from '@/types/Game'

export type Event = {
  id: number
  name: string
  description: string
  eventDate: Date
  maxPlayers: number
  players: User[]
  creator: User
  game: Game
}
