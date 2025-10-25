<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes['class']
    level: 1 | 2
  }>(),
  {
    level: 1
  }
)
</script>

<template>
  <h3
    :class="
      cn(
        { 'text-2xl': level == 1 },
        { 'text-xl': level == 2 },
        'font-semibold leading-none tracking-tight',
        props.class
      )
    "
  >
    <slot />
  </h3>
</template>
