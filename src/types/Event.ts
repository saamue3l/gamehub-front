import type { User } from '@/types/User'
import type { Game } from '@/types/Game'
import * as z from 'zod'

export type Event = {
  id: number
  name: string
  description: string
  eventDate: Date
  maxPlayers: number
  participants: User[]
  creator: User
  game: Game
}

/* === CREATE EVENT === */
export const eventCreateSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  maxPlayers: z.number().min(2),
  eventDate: z.date().min(new Date(), { message: "La date de l'évènement doit être future" }),
  gameId: z.number().min(1)
})

export type EventCreate = z.infer<typeof eventCreateSchema>
