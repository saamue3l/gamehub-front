<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps<{
  title: string;
  description: string;
}>();

import { Award } from 'lucide-vue-next'
</script>

<template>
  <div class="flex">
    <div class="flex w-25 bg-secondary p-2 rounded-md mr-1 items-center justify-center">
      <Award class="size-6"/>
    </div>
    <div class="flex flex-col flex-1 justify-center">
      <p class="text-foreground font-bold text-sm">{{ title }}</p>
      <p class="text-foreground text-xs">{{ description }}</p>
    </div>
  </div>
</template>

<style scoped>

</style>