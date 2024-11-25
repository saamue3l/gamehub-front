import type { XpAndSuccessResponse } from '@/types/Success'

export type Availability = {
  id: number
  dayOfWeek: string
  morning: boolean
  afternoon: boolean
  evening: boolean
  night: boolean
  userId: number
}

export type AvailabilityResponse = {
  availability: Availability[]
  xpAndSuccessResponse: XpAndSuccessResponse
}
