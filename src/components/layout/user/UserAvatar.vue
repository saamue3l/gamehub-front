<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { User } from '@/types/User'
import type { UserInfo } from '@/types/UserInfo'

withDefaults(
  defineProps<{
    user: User | UserInfo
    size: string
  }>(),
  {
    size: '8'
  }
)
</script>

<template>
  <Avatar :class="`size-${size}`">
    <AvatarImage :src="user.picture" :alt="user.username" />
    <AvatarFallback>{{ user.username.substring(0, 2).toUpperCase() }}</AvatarFallback>
  </Avatar>
</template>

<style scoped></style>
