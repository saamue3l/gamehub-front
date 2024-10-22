import type { Platform } from '@/types/Platform'

export type Game = {
  id: number
  name: string
  corverUrl: string
  platforms: Platform[]
}
