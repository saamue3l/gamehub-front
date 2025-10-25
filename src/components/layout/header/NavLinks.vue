<script setup lang="ts">
import { routes } from '@/router/index.js'
import { computed } from 'vue'
import { UserStore } from '@/store/userStore'
import { PusherStore } from '@/store/pusherStore'

const userStore = UserStore()
const pusherStore = PusherStore()
const isLoggedIn = computed(() => !!userStore.username)

</script>

<template>
  <nav>
    <ul class="flex" v-if="isLoggedIn">
      <li v-for="(route, index) in routes.filter((r) => r.inNav)" class="mr-2" :key="index">
        <router-link
          :to="route.path"
          class="text-custom-white text-sm font-medium rounded-3xl hover:bg-secondary [&.router-link-active]:bg-secondary px-2 py-2 transition relative"
        >
          {{ route.name.toUpperCase() }}

          <!-- Afficher le badge de notifications uniquement pour les messages -->
          <span
            v-if="route.name.toUpperCase() === 'MESSAGES' && pusherStore.unreadConversationsCount > 0"
            class="absolute -top-2 -right-4 ml-auto bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
          >
            {{ pusherStore.unreadConversationsCount }}
          </span>
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<style scoped></style>
