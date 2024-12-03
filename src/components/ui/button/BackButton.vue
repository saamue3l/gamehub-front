<script setup lang="ts">
import { Button } from '@/components/ui/button/index'

defineProps<{
  to: string
}>()
</script>

<template>
  <router-link :to="to" as-child>
    <Button variant="secondary" class="w-min">← Retour</Button>
  </router-link>
</template>

<style scoped></style>
