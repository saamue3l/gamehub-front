<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogScrollContent,
  DialogTitle,
  DialogTrigger,
  DialogContent // Ajout de DialogContent
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import UserSearch from '@/components/ui/user-search/UserSearch.vue'
import { httpBackend } from '@/lib/utils'

const emit = defineEmits(['message-sent'])

const props = defineProps({
  currentUserId: {
    type: Number,
    required: true
  },
  preselectedUserId: Number,
  autoOpen: Boolean
})

const isLoading = ref(false)
const selectedUser = ref(null)
const isOpen = ref(false) // Renommé pour plus de clarté
const newMessage = ref('')

// Modifié pour utiliser isOpen
onMounted(async () => {
  console.log('Props:', props) // Debug
  if (props.preselectedUserId) {
    try {
      selectedUser.value = await httpBackend(
        `/api/utils/getUserById/${props.preselectedUserId}`,
        'GET'
      )
      console.log('Selected user:', selectedUser.value) // Debug
      if (props.autoOpen) {
        isOpen.value = true
        console.log('Setting dialog to open') // Debug
      }
    } catch (error) {
      console.error('Error fetching user:', error)
    }
  }
})

async function sendMessage() {
  isLoading.value = true
  // Étape 1 : Créer la conversation si elle n'existe pas
  const userIds = [props.currentUserId, selectedUser.value.id]
  const conversationId = await createConversationWithUsers(userIds)

  // Étape 2 : Envoyer le message dans la conversation
  try {
    await httpBackend(`/api/conversations/${conversationId}/sendMessage`, 'POST', {
      content: newMessage.value
    })

    // Émettre la conversation sélectionnée après l'envoi
    emit('message-sent', conversationId)
    closeDialog()
  } catch (error) {
    console.error("Erreur lors de l'envoi du message:", error)
  } finally {
    isLoading.value = false
  }
}

async function createConversationWithUsers(userIds: number[]) {
  try {
    console.log("Création d'une conversation avec les userIds : ", userIds)
    const response = await httpBackend('/api/conversations/createConversation', 'POST', {
      user_ids: userIds
    })
    console.log('Réponse de la création de la conversation : ', response)
    return response.conversationId
  } catch (error) {
    console.error('Erreur lors de la création de la conversation:', error)
    throw error
  }
}

function onOpenChange(open: boolean) {
  if (!open) {
    resetDialog()
  }
  isOpen.value = open
}

function closeDialog() {
  isOpen.value = false
  resetDialog()
}

function resetDialog() {
  selectedUser.value = null
  newMessage.value = ''
}

function handleUserSelect(user) {
  selectedUser.value = user
}
</script>

<template>
  <Dialog v-model:open="isOpen" @update:open="onOpenChange">
    <DialogTrigger asChild>
      <Button class="w-full rounded-full text-foreground">
        <span class="mx-1">+</span> <span class="mr-1">Nouveau message</span>
      </Button>
    </DialogTrigger>
    <DialogContent>
      <!-- Remplacé DialogScrollContent par DialogContent -->
      <form @submit.prevent="sendMessage">
        <DialogHeader>
          <DialogTitle class="pb-6">Nouveau message</DialogTitle>
        </DialogHeader>

        <UserSearch v-if="!selectedUser" @selected-user="handleUserSelect" />

        <div v-else class="mb-4">Destinataire : {{ selectedUser.username }}</div>

        <textarea
          v-model="newMessage"
          placeholder="Message"
          class="w-full mb-4 p-2 border border-gray-300 rounded text-black"
        ></textarea>

        <DialogFooter class="flex flex-col space-y-4 md:space-y-0 md:flex-row md:space-x-4">
          <Button type="button" variant="outline" @click="closeDialog">Annuler</Button>
          <Button type="submit" :disabled="!selectedUser || !newMessage.trim() || isLoading">{{
            isLoading ? 'Envoi...' : 'Envoyer'
          }}</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
