<script setup lang="ts">
import LoadingSpinner from '@/components/ui/feedback/spinner/LoadingSpinner.vue'
import { Save } from 'lucide-vue-next'
import { Button } from '@/components/ui/button/index'

withDefaults(
  defineProps<{
    isLoading: boolean
  }>(),
  {
    isLoading: false
  }
)
</script>

<template>
  <Button @click="$emit('click')" variant="secondary" size="icon" :disabled="editingLoading">
    <LoadingSpinner v-if="editingLoading" />
    <Save v-else />
  </Button>
</template>

<style scoped></style>
