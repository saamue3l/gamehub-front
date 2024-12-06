<template>
  <div class="flex flex-col space-y-4 md:space-y-0 md:flex-row md:space-x-4">
    <!-- Dialog pour Connexion -->
    <Dialog>
      <DialogTrigger as-child>
        <Button variant="default" size="none" class="text-sm py-1.5 min-w-44"> Connexion </Button>
      </DialogTrigger>
      <DialogScrollContent class="sm:max-w-[425px]">
        <Login />
      </DialogScrollContent>
    </Dialog>

    <!-- Dialog pour Inscription -->
    <Dialog>
      <DialogTrigger as-child>
        <Button
          variant="secondary"
          size="none"
          class="text-sm py-1.5 min-w-44"
          @click="isRegisterOpen = true"
          >Inscription</Button
        >
      </DialogTrigger>
      <DialogScrollContent class="sm:max-w-[425px]">
        <Register />
      </DialogScrollContent>
    </Dialog>

    <!-- Bouton de connexion Google -->
    <Button
      variant="default"
      size="none"
      class="text-sm py-1.5 min-w-44"
      @click="redirectToGoogle"
    >
      Connexion avec Google
    </Button>
  </div>
</template>

<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue'
import { Dialog, DialogScrollContent, DialogTrigger } from '@/components/ui/dialog'
import Login from '@/components/home/Login.vue'
import Register from '@/components/home/Register.vue'

const redirectToGoogle = () => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  window.location.href = `${apiBaseUrl}/api/auth/google/redirect`;
}
</script>

<style scoped></style>
