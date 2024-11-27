<script setup lang="ts">
import { Pencil } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
</script>

<template>
  <!-- Don't know why but emiting a click event here does not work but works on the remove button-->
  <Button variant="outline" size="icon"><Pencil /></Button>
</template>

<style scoped></style>
