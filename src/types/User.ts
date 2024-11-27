export type User = {
  id: number
  username: string
  email: string
  picture: string
  xp: number
}

export type GetUserResponse = {
  email: string
  username: string
}
