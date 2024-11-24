<template>
  <div>
    <Header />
    <main class="w-full flex flex-col items-center bg-custom-background flex-grow mb-7">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import Header from '@/components/layout/header/Header.vue'
</script>
