<template>
  <TitleContainer title="Succès">
    <div class="flex flex-col p-2 space-y-2">
      <AchievementItem title="Succès" description="Description du succès"></AchievementItem>
      <AchievementItem title="Succès" description="Description du succès"></AchievementItem>

    </div>
  </TitleContainer>
</template>

<script setup lang="ts">
import TitleContainer from '@/components/profile/TitleContainer.vue';
import { Award } from 'lucide-vue-next'
import AchievementItem from '@/components/profile/AchievementItem.vue'

</script>

<style scoped></style>