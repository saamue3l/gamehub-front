<template>
  <div class="flex items-center">
    <input
      v-model="newMessageContent"
      @keyup.enter="sendMessage"
      type="text"
      placeholder="Type your message..."
      class="flex-grow border rounded p-2 mr-2 text-black"
    />
    <Button @click="sendMessage">Envoyer</Button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'

// Déclarez l'événement avec `defineEmits`
const emit = defineEmits(['send-message'])

const newMessageContent = ref('')

function sendMessage() {
  if (newMessageContent.value.trim()) {
    // Émettez l'événement avec le contenu du message
    emit('send-message', newMessageContent.value.trim())
    newMessageContent.value = '' // Réinitialisez l'input après l'envoi
  }
}
</script>

<style scoped></style>
