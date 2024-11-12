<template>
  <div class="flex items-center">
    <input
      v-model="newMessageContent"
      @keyup.enter="sendMessage"
      type="text"
      placeholder="Type your message..."
      class="flex-grow border rounded p-2 mr-2 text-black"
    />
    <Button @click="sendMessage">Send</Button>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
</script>

<style scoped></style>
