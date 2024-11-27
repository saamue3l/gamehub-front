<script setup lang="ts">
import type { PropType } from 'vue';

const props = defineProps({
  user: {
    type: Object as PropType<{ id: number, username: string, picture: string }>,
    required: true,
  },
  isSelected: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <div
    class="user-card border border-gray-300 rounded-lg p-4 m-1 text-center cursor-pointer"
    :class="{ 'bg-blue-100': isSelected }"
  >
    <img :src="user.picture" alt="User Picture" class="profile-image mx-auto mb-2 rounded-full w-12 h-12" />
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