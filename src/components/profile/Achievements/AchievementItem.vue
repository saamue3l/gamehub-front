<script setup lang="ts">
import { defineProps } from 'vue'
import { Award } from 'lucide-vue-next'

const props = defineProps<{
  title: string
  description: string
  isUnlocked?: boolean
  showUnlockState?: boolean
}>()
</script>

<template>
  <div
    :class="[
      'flex transition-all duration-200',
      { 'opacity-40 hover:opacity-60': showUnlockState && !isUnlocked }
    ]"
  >
    <div
      :class="[
        'flex w-25 bg-secondary p-2 rounded-md mr-1 items-center justify-center',
        { 'glow-effect': showUnlockState && isUnlocked }
      ]"
    >
      <Award class="size-6" :class="showUnlockState ? (isUnlocked ? 'text-foreground' : '') : ''" />
    </div>
    <div class="flex flex-col flex-1 justify-center">
      <div class="flex items-center gap-2">
        <p class="text-foreground font-bold text-sm">{{ title }}</p>
      </div>
      <p class="text-foreground text-xs">{{ description }}</p>
    </div>
  </div>
</template>

<style scoped>
.glow-effect {
  animation: glow 2s ease-in-out infinite;
  @apply border-2 border-blue-400;
}

@keyframes glow {
  0% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
  }
  50% {
    box-shadow: 0 0 10px 5px rgba(59, 130, 246, 0.2);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
  }
}
</style>
