<script setup lang="ts">
import { Trash2 } from 'lucide-vue-next'
import { Button } from '@/components/ui/button/index'
import LoadingSpinner from '@/components/ui/feedback/spinner/LoadingSpinner.vue'
withDefaults(defineProps<{ isLoading: boolean }>(), { isLoading: false })
</script>

<template>
  <Button variant="destructive" size="icon">
    <LoadingSpinner v-if="editingLoading" />
    <Trash2 v-else
  /></Button>
</template>

<style scoped></style>
