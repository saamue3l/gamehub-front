import * as z from 'zod'

export const loginPostSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères')
})

export type loginPost = z.infer<typeof loginPostSchema>

export type loginResponse = {
  username: string
  roleId: number
  statusId: number
  xp: number
  picture: string
  token: string
}
