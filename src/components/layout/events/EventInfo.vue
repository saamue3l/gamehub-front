<script setup lang="ts">
defineProps<{
  text: string
}>()
</script>

<template>
  <article class="text-sm text-primary flex gap-1 items-center">
    <span class="inline-block">
      <slot />
    </span>
    {{ text }}
  </article>
</template>

<style scoped></style>
