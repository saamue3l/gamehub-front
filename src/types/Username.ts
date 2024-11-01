import type { Platform } from '@/types/Platform'

export type Username = {
  username: string
  platform: Platform
}

export type UsernameUpdate = {
  platformId: number
  username: string
}
