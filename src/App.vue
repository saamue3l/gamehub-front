<script setup lang="ts">
import MainLayout from '@/components/layout/MainLayout.vue'
</script>

<template>
  <MainLayout>
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </MainLayout>
</template>
