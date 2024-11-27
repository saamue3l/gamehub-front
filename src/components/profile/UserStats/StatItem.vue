<script setup lang="ts">
import { defineProps, computed } from 'vue'

const props = defineProps<{
  icon: any
  value: number
  label: string
}>()

const formattedValue = computed(() => {
  if (props.value >= 1_000_000) {
    return `${(props.value / 1_000_000).toFixed(1)}M`
  }
  if (props.value >= 1000) {
    return `${(props.value / 1000).toFixed(1)}K`
  }
  return props.value.toString()
})
</script>

<template>
  <div class="flex flex-col items-center justify-center px-4 min-w-0 relative">
    <div class="flex items-center gap-2">
      <component :is="props.icon" class="h-4 w-4 text-primary shrink-0" />
      <span class="text-xl font-bold text-white truncate">{{ formattedValue }}</span>
    </div>
    <span class="text-xs text-gray-400 text-center truncate w-full">{{ label }}</span>
  </div>
</template>
