<template>
  <div class="flex flex-col space-y-4 md:space-y-0 md:flex-row md:space-x-4">
    <!-- Dialog pour Connexion -->
    <Dialog>
      <DialogTrigger as-child>
        <Button variant="default" size="none" class="text-sm py-1.5 min-w-44">
          Connexion
        </Button>
      </DialogTrigger>
      <DialogScrollContent class="sm:max-w-[425px]">
        <Login />
      </DialogScrollContent>
    </Dialog>

    <!-- Dialog pour Inscription -->
    <Dialog>
      <DialogTrigger as-child>
        <Button variant="secondary" size="none" class="text-sm py-1.5 min-w-44" @click="isRegisterOpen = true">Inscription</Button>
      </DialogTrigger>
      <DialogScrollContent class="sm:max-w-[425px]">
        <Register />
      </DialogScrollContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Button from '@/components/ui/button/Button.vue'
import {
  Dialog,
  DialogScrollContent,
  DialogTrigger,
  DialogClose,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import Login from '@/components/home/Login.vue'
import Register from '@/components/home/Register.vue'
</script>

<style scoped></style>
