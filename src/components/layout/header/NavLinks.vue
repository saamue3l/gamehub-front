<script setup lang="ts">
import { routes } from '@/router/index.js'
</script>

<template>
  <nav>
    <ul class="flex">
      <li v-for="(route, index) in routes.filter((r) => r.inNav)" class="mr-2" :key="index">
        <router-link
          :to="route.path"
          class="text-custom-white text-sm font-medium rounded-3xl hover:bg-custom-secondary [&.router-link-active]:bg-custom-secondary px-2 py-0.5 transition"
          >{{ route.name.toUpperCase() }}</router-link
        >
      </li>
    </ul>
  </nav>
</template>

<style scoped></style>
