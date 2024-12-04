<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { User } from '@/types/User'
import type { UserInfo } from '@/types/UserInfo'
import defaultPfp from '@/assets/defaultPfp1.png'

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
    <AvatarImage v-if="user.picture" :src="normalizeImageUrl(user.picture)" :alt="user.username" />
    <AvatarImage v-else :src="defaultPfp" alt="photo de profil" />
  </Avatar>
</template>
