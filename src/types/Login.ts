import * as z from 'zod'

export const loginPostSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
})

export type LoginPost = z.infer<typeof loginPostSchema>

export type LoginResponse = {
  username: string
  userId: number
  roleId: number
  statusId: number
  xp: number
  picture: string
  token: string
}
