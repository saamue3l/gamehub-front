<template>
  <header
    class="flex justify-center items-center px-4 py-2 bg-custom-background-dark text-custom-white"
  >
    <div class="w-3/5 flex justify-between items-center">
      <div class="flex items-center">
        <router-link to="/" class="mr-5">
          <img src="@/assets/logoBlue.png" alt="Logo" class="h-6" />
        </router-link>
        <NavLinks />
      </div>
      <div class="flex items-center space-x-2">
        <ProfileMenu />
        <AlertMenu />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import NavLinks from '@/components/layout/header/NavLinks.vue'
import ProfileMenu from '@/components/layout/header/ProfileMenu.vue'
import AlertMenu from '@/components/layout/header/AlertMenu.vue'
</script>

<style scoped></style>
