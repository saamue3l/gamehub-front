<!-- Petite carte présentant les informations principale d'un évènement de jeu-->

<script setup lang="ts">
defineProps<{
  event: Event
}>()
</script>

<template>
  <article>
    {{ event.name }}
  </article>
</template>

<style scoped></style>
