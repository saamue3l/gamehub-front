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
      <div v-if="isLoggedIn" class="hidden md:flex items-center justify-end space-x-2">
        <ProfileMenu />
        <AlertMenu />
      </div>

      <!-- if mobile, display a burger -->
      <div v-if="isLoggedIn" class="md:hidden">
        <Sheet v-model:open="isSheetOpen">
          <SheetTrigger><BurgerMenu /></SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetDescription>
                <MobileMenu @close-sheet="isSheetOpen = false" />
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import NavLinks from '@/components/layout/header/NavLinks.vue'
import ProfileMenu from '@/components/layout/header/ProfileMenu.vue'
//import AlertMenu from '@/components/layout/header/AlertMenu.vue'
import BurgerMenu from '@/components/layout/header/BurgerMenu.vue'
import MobileMenu from '@/components/layout/header/MobileMenu.vue'
import { UserStore } from '@/store/userStore'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTrigger
} from '@/components/ui/sheet'

const userStore = UserStore()
const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}
const isSheetOpen = ref(false)

const isLoggedIn = computed(() => !!userStore.username)
</script>

<style scoped></style>
