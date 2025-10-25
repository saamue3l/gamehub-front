<template>
  <div>
    <p class="text-custom-white text-sm font-bold pb-1 pl-2 uppercase">{{ title }}</p>
    <div class="border border-custom-white rounded-lg">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps<{
  title: string;
}>();
</script>

<style scoped></style>