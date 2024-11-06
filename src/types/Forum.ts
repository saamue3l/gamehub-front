import type { User } from '@/types/User'

export type Forum = {
  id: number
  name: string
  topics: Topic[]
}

export type Topic = {
  id: number
  title: string
  creator: User
  forum: Forum
  posts: Post[]
  visible: boolean
}

export type Post = {
  id: number
  content: string
  creationDate: Date
  user: User
  topic: Topic
  visible: boolean
}
