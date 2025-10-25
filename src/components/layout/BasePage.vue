<template>
  <section class="md:w-3/5 w-4/5">
    <p class="text-custom-white text-2xl font-bold mt-14 mb-4">{{ title.toUpperCase() }}</p>
    <div class="flex flex-col justify-between gap-5">
      <slot></slot>
    </div>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string
}>()
</script>

<style scoped></style>
