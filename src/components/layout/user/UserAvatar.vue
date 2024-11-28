<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { User } from '@/types/User'
import type { UserInfo } from '@/types/UserInfo'

const props = withDefaults(
  defineProps<{
    user: User | UserInfo
    size: string
  }>(),
  {
    size: '8'
  }
)

function normalizeImageUrl(url: string): string {
  if (!url) {
    return ''
  }

  const lastStorageIndex = url.lastIndexOf('/storage/')

  return `${import.meta.env.VITE_BACKEND_HOST}/${url.slice(lastStorageIndex + 1)}`
}
</script>

<template>
  <Avatar :class="`size-${size}`">
    <AvatarImage :src="normalizeImageUrl(user.picture)" :alt="user.username" />
    <AvatarFallback>{{ user.username.substring(0, 2).toUpperCase() }}</AvatarFallback>
  </Avatar>
</template>
