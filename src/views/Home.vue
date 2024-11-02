<script setup lang="ts">
import BasePage from '@/components/layout/BasePage.vue'
import WelcomeMessage from '@/components/home/WelcomeMessage.vue'
import AuthButtons from '@/components/home/AuthButtons.vue'
</script>

<template>
  <BasePage title="">
    <div class="flex flex-col md:flex-row">
      <!-- Left side with WelcomeMessage and AuthButtons -->
      <div class="w-full md:w-3/5 mx-auto flex flex-col justify-between">
        <WelcomeMessage></WelcomeMessage>
        <AuthButtons></AuthButtons>
      </div>

      <!-- Right side with image, matching left side height -->
      <div class="hidden md:flex w-full md:w-2/5 items-center">
        <div class="relative w-full h-full">
          <img
            src="../assets/joachimSmall.png"
            alt=""
            class="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  </BasePage>
</template>

<style scoped></style>
