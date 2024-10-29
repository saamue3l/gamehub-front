import * as z from 'zod'

export const registerPostSchema = z.object({
  email: z.string().email('Adresse email invalide').min(6),
  username: z.string().min(2).max(50),
  password: z.string().min(6),
  passwordConfirm: z.string().min(6)
})

export type RegisterPost = z.infer<typeof registerPostSchema>

export type RegisterResponse = {
  username: string
  roleId: number
  statusId: number
  xp: number
  picture: string
  token: string
}
