<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next'
import type { PrimitiveProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { spinnerVariants, type SpinnerVariants } from '.'

interface Props extends PrimitiveProps {
  size?: SpinnerVariants['size']
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    :class="cn(spinnerVariants({ size }), props.class)"
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
  </svg>
</template>

<style scoped></style>
