<script setup lang="ts">
import type { User } from '@/types/User'
import UserAvatar from '@/components/layout/user/UserAvatar.vue'

defineProps<{
  user: User
}>()
</script>

<template>
  <router-link
    :to="{ name: 'Profil', params: { username: user.username } }"
    class="text-primary flex justify-around items-center gap-1.5 w-min hover:bg-secondary rounded-full pr-3 transition"
  >
    <UserAvatar :user="user" />

    <div class="truncate">{{ user.username }}</div>
  </router-link>
</template>

<style scoped></style>
