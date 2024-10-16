<template>
  <section class="w-3/5">
    <p class="text-custom-white text-2xl font-bold mt-14 mb-4">{{ title }}</p>
    <div class="flex justify-between">
      <slot></slot>
    </div>
  </section>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps<{
  title: string;
}>();
</script>

<style scoped></style>