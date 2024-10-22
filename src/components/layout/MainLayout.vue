<template>
  <div>
    <Header />
    <main class="w-full min-h-screen flex flex-col items-center bg-custom-background flex-grow">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import Header from '@/components/layout/header/Header.vue';
</script>

