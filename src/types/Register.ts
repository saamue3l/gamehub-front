import * as z from 'zod'

export const registerPostSchema = z
  .object({
    email: z
      .string({
        required_error: "L'email est requis"
      })
      .email("Format d'email invalide"),

    username: z
      .string({
        required_error: "Le nom d'utilisateur est requis"
      })
      .min(3, {
        message: "Le nom d'utilisateur doit contenir au moins 3 caractères"
      })
      .max(20, {
        message: "Le nom d'utilisateur ne doit pas dépasser 20 caractères"
      }),

    password: z
      .string({
        required_error: 'Le mot de passe est requis'
      })
      .min(8, {
        message: 'Le mot de passe doit contenir au moins 8 caractères'
      })
      .max(50, {
        message: 'Le mot de passe ne doit pas dépasser 50 caractères'
      }),

    passwordConfirm: z.string({
      required_error: 'La confirmation du mot de passe est requise'
    })
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['passwordConfirm']
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
