<script setup lang="ts">
import type { PropType } from 'vue'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import defaultPfp from '@/assets/defaultPfp1.png'

const props = defineProps({
  user: {
    type: Object as PropType<{ id: number; username: string; picture: string }>,
    required: true
  },
  isSelected: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div
    class="user-card border border-gray-300 rounded-lg p-4 m-1 text-center cursor-pointer"
    :class="{ 'bg-blue-100': isSelected }"
  >
    <Avatar class="size-12">
      <AvatarImage v-if="user.picture" :src="user.picture" :alt="user.username" />
      <AvatarImage v-else :src="defaultPfp" alt="photo de profil" />
    </Avatar>
    <p class="username truncate font-bold text-sm mb-2">{{ user.username }}</p>
  </div>
</template>

<style scoped>
.user-card {
  transition: background-color 0.3s;
  min-width: 6rem; /* Fixed width */
  max-width: 6rem; /* Fixed width */
  height: 8rem; /* Fixed height */
  margin: 1rem 0.25rem;
}
.user-card:hover {
  background-color: #3b82f6; /* Shadcn blue */
}

.user-card.bg-blue-100 {
  background-color: #3b82f6; /* Shadcn blue */
}
</style>
