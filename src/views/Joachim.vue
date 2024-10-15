<script setup lang="ts">

import MediumContent from '@/components/layout/main/MediumContent.vue'
</script>

<template>
  <MediumContent>
    <div>
      <img src="@/assets/joachim.jpg" />
    </div>
  </MediumContent>
</template>

<style scoped>
div {
  display: flex;
  justify-content: center;
  img {
    max-height: 100vh;
  }
}
</style>