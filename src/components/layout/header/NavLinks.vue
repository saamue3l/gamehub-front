<script setup lang="ts">
import { routes } from '@/router/index.js'
import { computed } from 'vue'
import { UserStore } from '@/store/userStore'

const userStore = UserStore()
const isLoggedIn = computed(() => !!userStore.username)
</script>

<template>
  <nav>
    <ul class="flex" v-if="isLoggedIn">
      <li v-for="(route, index) in routes.filter((r) => r.inNav)" class="mr-2" :key="index">
        <router-link
          :to="route.path"
          class="text-custom-white text-sm font-medium rounded-3xl hover:bg-secondary [&.router-link-active]:bg-secondary px-2 py-2 transition"
          >{{ route.name.toUpperCase() }}</router-link
        >
      </li>
    </ul>
  </nav>
</template>

<style scoped></style>
