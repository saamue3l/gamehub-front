<script setup lang="ts">
import FavoriteGames from '@/components/profile/FavoriteGames.vue'
import Alias from '@/components/profile/Alias.vue'
import Availability from '@/components/profile/Availability.vue'
import Achievements from '@/components/profile/Achievements.vue'
import BasePage from '@/components/layout/BasePage.vue'
import UserInfo from '@/components/profile/UserInfo.vue'
</script>

<template>
  <BasePage title="">
    <div class="flex flex-col">
      <UserInfo avatarSrc="src/assets/joachim.jpg" pseudo="Pseudo" level="42" progress="42" />
      <div class="flex justify-between">
        <div class="flex flex-col flex-1 pr-8 min-w-96">
          <FavoriteGames />
        </div>
        <div class="min-w-64 max-w-64 flex flex-col space-y-8">
          <Alias />
          <Availability />
          <Achievements />
        </div>
      </div>
    </div>
  </BasePage>
</template>

<style scoped></style>
