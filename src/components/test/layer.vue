<script setup lang="ts">
const props = defineProps<{
  imagePath: string
}>()
</script>

<template>
  <img v-bind:src="imagePath" />
</template>

<style scoped>
img {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 1920px;
  height: 1080px;
  opacity: 0.3;

  pointer-events: none;
}
</style>
