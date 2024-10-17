<script setup lang="ts">
import { defineProps, computed } from 'vue';

const props = defineProps<{
  variant?: 'primary' | 'secondary',
  size?: 'small' | 'medium' | 'large',
  title?: string
}>();

const buttonClass = computed(() => {
  const baseClasses = 'rounded-md focus:outline-none transition ease-in-out duration-200';

  const variantClasses = props.variant === 'secondary'
    ? 'bg-gray-800 text-white hover:bg-gray-600'
    : 'bg-blue-500 text-white hover:bg-blue-600';

  const sizeClasses = {
    small: 'text-sm py-1 min-w-32',
    medium: 'text-sm py-1.5 min-w-48',
    large: 'text-lg py-2 min-w-64'
  }[props.size || 'medium'];

  return `${baseClasses} ${variantClasses} ${sizeClasses}`;
});
</script>

<template>
  <button :class="buttonClass">
    {{ title }}
    <slot />
  </button>
</template>

<style scoped>
</style>
