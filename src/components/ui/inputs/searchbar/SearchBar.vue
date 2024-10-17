<script setup lang="ts">
withDefaults(defineProps(), {
  placeholder: 'Rechercher'
})
</script>
<template>
  <input class="rounded bg-slate-800 border-slate-200" :placeholder="placeholder" />
</template>
<style scoped></style>
