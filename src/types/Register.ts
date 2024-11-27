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

export const updateProfileSchema = z.object({
  email: z
    .string({
      required_error: "L'email est requis"
    })
    .email("Format d'email invalide")
    .optional(),

  username: z
    .string({
      required_error: "Le nom d'utilisateur est requis"
    })
    .min(3, {
      message: "Le nom d'utilisateur doit contenir au moins 3 caractères"
    })
    .max(20, {
      message: "Le nom d'utilisateur ne doit pas dépasser 20 caractères"
    })
    .optional(),

  profilePicture: z.instanceof(File).optional()
})

export const changePasswordSchema = z
  .object({
    current_password: z.string(),
    password: z.string().min(8, 'Le nouveau mot de passe doit contenir au moins 8 caractères'),
    password_confirmation: z.string().min(1, 'La confirmation du mot de passe est requise')
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['password_confirmation']
  })

export type RegisterPost = z.infer<typeof registerPostSchema>
export type ChangePasswordPost = z.infer<typeof changePasswordSchema>
export type UpdateProfilePost = z.infer<typeof updateProfileSchema>

export type RegisterResponse = {
  username: string
  roleId: number
  statusId: number
  xp: number
  picture: string
  token: string
}
