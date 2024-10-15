<script setup lang="ts">
import { routes } from '@/router/index.js'
import Header from '@/components/layout/header/Header.vue'
</script>

<template>
  <Header></Header>

  <main>
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </main>
</template>

<style scoped>
/* Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.13s ease-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
