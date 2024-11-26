<script setup lang="ts">
import { ref, watch } from 'vue'
import {
  Dialog,
  DialogTrigger,
  DialogScrollContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import UserSearch from '@/components/ui/user-search/UserSearch.vue'
import { httpBackend } from '@/lib/utils'

const emit = defineEmits(['message-sent']);

const selectedUser = ref(null)
const isDialogOpen = ref(false)
const newMessage = ref('')

async function sendMessage() {
  try {
    await httpBackend('/api/sendMessage', 'POST', {
      recipientId: selectedUser.value.id,
      content: newMessage.value
    })

    // Émettre l'utilisateur sélectionné après l'envoi
    emit('message-sent', selectedUser.value);
    closeDialog()
  } catch (error) {
    console.error('Erreur lors de l\'envoi du message:', error)
  }
}

function closeDialog() {
  isDialogOpen.value = false;
  resetDialog();
}

function resetDialog() {
  selectedUser.value = null; // Réinitialiser l'utilisateur sélectionné
  newMessage.value = '';
}

function handleUserSelect(user) {
  selectedUser.value = user
}

watch(isDialogOpen, (newVal) => {
  if (!newVal) {
    resetDialog();
  }
});
</script>

<template>
  <Dialog v-model:open="isDialogOpen" @close="closeDialog">
    <DialogTrigger as-child>
      <div
        class="relative border border-white rounded-full p-2 mt-2 flex flex-row items-center justify-center cursor-pointer bg-blue-600 text-white font-bold text-sm"
      >
        <span class="mx-1">+</span>
        <span class="mr-1">Nouveau message</span>
      </div>
    </DialogTrigger>
    <DialogScrollContent class="flex flex-col gap-6">
      <form @submit.prevent="sendMessage">
        <DialogHeader>
          <DialogTitle class="pb-6">Nouveau message</DialogTitle>
        </DialogHeader>

        <UserSearch @selected-user="handleUserSelect" />

        <textarea
          v-model="newMessage"
          placeholder="Message"
          class="w-full mb-4 p-2 border border-gray-300 rounded text-black"
        ></textarea>

        <DialogFooter class="flex flex-col space-y-4 md:space-y-0 md:flex-row md:space-x-4">
          <Button type="submit">Envoyer</Button>
          <Button type="button" @click="closeDialog">Fermer</Button>
        </DialogFooter>
      </form>
    </DialogScrollContent>
  </Dialog>
</template>

<style scoped>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.dialog {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  width: 300px;
  text-align: center;
}

.dialog input,
.dialog textarea {
  width: 100%;
  margin-bottom: 1rem;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.dialog button {
  margin: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.dialog button {
  background-color: #3b82f6; /* Shadcn blue */
  color: white;
}
</style>
