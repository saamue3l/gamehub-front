<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const emit = defineEmits(['send-message'])
const message = ref('')
const isLoading = ref(false)

async function sendMessage() {
  if (message.value.trim()) {
    isLoading.value = true
    await emit('send-message', message.value)
    message.value = ''
    isLoading.value = false
  }
}
</script>

<template>
  <form @submit.prevent="sendMessage" class="flex gap-2">
    <Input v-model="message" placeholder="Votre message..." :disabled="isLoading" />
    <Button type="submit" :disabled="isLoading || !message.trim()">
      {{ isLoading ? 'Envoi...' : 'Envoyer' }}
    </Button>
  </form>
</template>
