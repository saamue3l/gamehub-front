import type { User } from '@/types/User'
import { z } from 'zod'

export type Forum = {
  id: number
  name: string
  topics: Topic[]
}

export type Topic = {
  id: number
  title: string
  creator: User
  posts: Post[]
  visible?: boolean
  firstPostIndex?: number

  forumId?: number
}

export type Post = {
  id: number
  content: string
  creationDate: Date
  user: User
  visible?: boolean
  reactions?: Reaction[]

  // In some cases, we want to access the parent topic
  topic?: Topic
}

export class Reaction {
  public emoji: string
  public users: User[]
  constructor(emoji: string, users: User[]) {
    this.emoji = emoji
    this.users = users
  }

  addUser(user: User) {
    this.users.push(user)
  }

  removeUser(user: User) {
    this.users.splice(this.users.indexOf(this.users.find((u) => u.username == user.username)!), 1)
  }

  userReacted(user: User) {
    return this.users.some((u) => u.username == user.username)
  }
}

/* === CREATE POST === */
export const postCreateSchema = z.object({
  content: z.string().min(1)
})

export type PostCreate = z.infer<typeof postCreateSchema>

/* === CREATE TOPIC === */
export const topicCreateSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  forumId: z.number().optional() // forumId is added by the application
})

export type TopicCreate = z.infer<typeof topicCreateSchema>

/* === CREATE FORUM === */
export const forumCreateSchema = z.object({
  name: z.string().min(1)
})

export type ForumCreate = z.infer<typeof forumCreateSchema>
