<script setup lang="ts">
import FavoriteGames from '@/components/profile/FavoriteGames.vue'
import Alias from '@/components/profile/Alias.vue'
import Availability from '@/components/profile/Availability.vue'
import Achievements from '@/components/profile/Achievements.vue'
import BasePage from '@/components/layout/BasePage.vue'
</script>

<template>
  <BasePage title="Profil">
    <div class="w-3/5 flex flex-col">
      <FavoriteGames />
    </div>
    <div class="w-1/3 flex flex-col space-y-8">
      <Alias />
      <Availability />
      <Achievements />
    </div>
  </BasePage>
</template>

<style scoped></style>
