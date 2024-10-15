<script setup lang="ts">
import FavoriteGames from '@/components/profile/FavoriteGames.vue'
import Alias from '@/components/profile/Alias.vue'
import Availability from '@/components/profile/Availability.vue'
import Achievements from '@/components/profile/Achievements.vue'
</script>

<template>
  <section class="w-3/5">
    <p class="text-custom-white text-2xl font-bold mt-14 mb-4">Profil</p>
    <div class="flex justify-between">
      <div class="w-3/5 flex flex-col">
        <FavoriteGames />
      </div>
      <div class="w-1/3 flex flex-col space-y-8">
        <Alias />
        <Availability />
        <Achievements />
      </div>
    </div>
  </section>
</template>

<style scoped></style>