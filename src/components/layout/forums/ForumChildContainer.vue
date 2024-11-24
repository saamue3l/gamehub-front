<script setup lang="ts">
/* Utilisé comme container pour les composants du forum (forum et topic). Simplement un titre et un contenu*/
import { Skeleton } from '@/components/ui/skeleton'

defineProps<{
  isLoading: boolean
  title: string | undefined
}>()
</script>

<template>
  <section class="flex flex-col gap-3">
    <header>
      <Skeleton v-if="isLoading" class="h-[30px] w-[250px]" />
      <h2 v-else>{{ title }}</h2>
    </header>
    <section class="w-full">
      <slot />
    </section>
  </section>
</template>

<style scoped></style>
