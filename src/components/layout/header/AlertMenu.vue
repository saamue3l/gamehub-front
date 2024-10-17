<template>
  <div class="relative">
    <button @click="toggleAlertMenu" class="focus:outline-none flex items-center hover:bg-custom-secondary hover:rounded-3xl p-0.5" ref="alertButton">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-6 w-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
      </svg>
    </button>
    <div v-if="isAlertMenuOpen" class="absolute right-0 mt-2 w-48 bg-custom-white rounded-md shadow-lg py-1 text-gray-700">
      <a href="#" class="text-sm block px-4 py-2 hover:bg-gray-100">Notification 1</a>
      <a href="#" class="text-sm block px-4 py-2 hover:bg-gray-100">Notification 2</a>
      <a href="#" class="text-sm block px-4 py-2 hover:bg-gray-100">Voir toutes les notifications</a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isAlertMenuOpen = ref(false)
const alertButton = ref(null)

const toggleAlertMenu = () => {
  isAlertMenuOpen.value = !isAlertMenuOpen.value
}

const closeMenus = (event) => {
  if (!alertButton.value.contains(event.target)) {
    isAlertMenuOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', closeMenus)
})

onUnmounted(() => {
  document.removeEventListener('click', closeMenus)
})
</script>

<style scoped></style>