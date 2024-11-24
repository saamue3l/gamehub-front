<script setup lang="ts">
import type { User } from '@/types/User'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

defineProps<{
  user: User
}>()
</script>

<template>
  <router-link
    :to="{ name: 'Profil', params: { username: user.username } }"
    class="text-primary flex justify-around items-center gap-1.5 w-min hover:bg-secondary rounded-full pr-3 transition"
  >
    <Avatar class="size-8">
      <AvatarImage :src="user.picture" alt="@shadcn" />
      <AvatarFallback>{{ user.username.substring(0, 2).toUpperCase() }}</AvatarFallback>
    </Avatar>
    {{ user.username }}
  </router-link>
</template>

<style scoped></style>
