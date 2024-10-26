<template>
  <header class="flex justify-center items-center px-4 py-2 text-custom-white">
    <div class="w-full md:w-3/5 flex justify-between items-center">

      <!-- logo + links(if not mobile) -->
      <div class="flex items-center">
        <router-link to="/" class="mr-5">
          <img src="@/assets/logoBlue.png" alt="Logo" class="h-6" />
        </router-link>
        <NavLinks class="hidden md:flex" />
      </div>

      <!-- profile et alerts(if not mobile) -->
      <div class="hidden md:flex items-center justify-end space-x-2">
        <ProfileMenu />
        <AlertMenu />
      </div>

      <!-- if mobile, display a burger -->
      <div class="md:hidden">
        <button @click="toggleMenu" class="focus:outline-none">
          <BurgerMenu/>
        </button>
      </div>
    </div>

    <!-- if the menu is open (burger button cliqued) on affiche le composant -->
    <div v-if="isMenuOpen" class="absolute right-0 top-16 w-48 bg-custom-background-dark text-white rounded-lg shadow-lg p-4 md:hidden z-50">
      <MobileMenu />
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import NavLinks from '@/components/layout/header/NavLinks.vue'
import ProfileMenu from '@/components/layout/header/ProfileMenu.vue'
import AlertMenu from '@/components/layout/header/AlertMenu.vue'
import BurgerMenu from '@/components/layout/header/BurgerMenu.vue'
import MobileMenu from '@/components/layout/header/MobileMenu.vue'

const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}
</script>

<style scoped></style>
