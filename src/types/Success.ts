export type Success = {
  name: string
  description: string
}

export type XpAndSuccessResponse = {
  xpGained?: number
  newSuccess?: {
    name: string
    description: string
  }
}
