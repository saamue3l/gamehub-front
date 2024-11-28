<script setup lang="ts">
import { onMounted, ref, nextTick } from 'vue'
import BasePage from '@/components/layout/BasePage.vue'
import MessagesList from '@/components/ui/message/MessagesList.vue'
import SendMessageInput from '@/components/messages/SendMessageInput.vue'
import { httpBackend } from '@/lib/utils'
import NewMessageDialog from '@/components/ui/dialog/NewMessageDialog.vue'
import ConversationsList from '@/components/messages/ConversationsList.vue'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useRoute } from 'vue-router'
import { ChevronLeft } from 'lucide-vue-next'
import { useMediaQuery } from '@vueuse/core'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const isMobile = useMediaQuery('(max-width: 768px)')
const showMessages = ref(false)
const conversations = ref([])
const selectedConversation = ref(null)
const messages = ref([])
const currentUserId = ref(null)
const messagesListRef = ref(null)

// Etats pour gérer les chargements
const isLoadingConversations = ref(true)
const isLoadingMessages = ref(false)

async function fetchCurrentUser() {
  try {
    currentUserId.value = await httpBackend('/api/currentUser', 'GET')
  } catch (error) {
    console.error('Erreur lors du chargement de l’utilisateur:', error)
  }
}

onMounted(fetchCurrentUser)
onMounted(loadConversations)

async function loadConversations(isFirstLoad = true) {
  if (isFirstLoad) isLoadingConversations.value = true // Début du chargement
  try {
    console.log('loadConversations called')

    // Récupérer la liste des conversations de l'utilisateur
    conversations.value = await httpBackend('/api/conversations/getConversations', 'GET')

    console.log('Conversations : ', conversations.value)

    if (Array.isArray(conversations.value) && conversations.value.length > 0) {
      selectConversation(conversations.value[0]) // Sélectionner la première conversation
    } else {
      console.warn('Aucune conversation disponible.')
    }
  } catch (error) {
    console.error('Erreur lors du chargement des conversations:', error)
  } finally {
    isLoadingConversations.value = false // Fin du chargement
  }
}

async function loadMessagesWithConversation(conversationId, isFirstLoad = true) {
  if (isFirstLoad) isLoadingMessages.value = true // Début du chargement
  console.log('isFirstLoad : ', isFirstLoad)
  try {
    // Charger les messages de la conversation
    messages.value = await httpBackend(`/api/conversations/${conversationId}/getMessages`, 'GET')
  } catch (error) {
    console.error('Erreur lors du chargement des messages:', error)
  } finally {
    isLoadingMessages.value = false // Fin du chargement
    await nextTick()
    if (messagesListRef.value?.messagesContainerRef) {
      const messagesContainer = messagesListRef.value.messagesContainerRef
      messagesContainer.scrollTop = messagesContainer.scrollHeight
    }
  }
}

async function sendMessageToConversation(
  conversationId: number,
  senderId: number,
  content: string
) {
  try {
    console.log(
      'sendMessageToConversation called with parameters : ',
      conversationId,
      senderId,
      content
    )
    await httpBackend(`/api/conversations/${conversationId}/sendMessage`, 'POST', {
      senderId,
      content
    })
    console.log('Message envoyé avec succès !')
  } catch (error) {
    console.error('Erreur lors de l’envoi du message:', error)
  }
}

async function handleSendMessage(message: string) {
  if (selectedConversation.value) {
    try {
      await sendMessageToConversation(
        selectedConversation.value.conversationId,
        currentUserId.value,
        message
      )
      await loadMessagesWithConversation(selectedConversation.value.conversationId, false)

      // Scroll vers le bas après l'envoi
      if (messagesListRef.value) {
        messagesListRef.value.scrollToBottom()
      }
    } catch (error) {
      console.error("Erreur lors de la gestion de l'envoi du message:", error)
    }
  }
}

function selectConversation(conversation) {
  if (conversation !== selectedConversation.value) {
    messages.value = []
    selectedConversation.value = conversation
    if (isMobile.value) {
      showMessages.value = true
    }
    loadMessagesWithConversation(selectedConversation.value.conversationId)
  }
}

function newConversationCreated(conversation) {
  console.log('newConversationCreated called with parameter : ', conversation)
  loadConversations(false) // Recharger la liste des conversations après la création d'une nouvelle
  selectConversation(conversation) // Sélectionner la nouvelle conversation
}

function goBackToConversations() {
  showMessages.value = false
}

// Messages.vue
const route = useRoute()

onMounted(async () => {
  if (route.query.newMessage && route.query.userId) {
    const preselectedUserId = parseInt(route.query.userId as string)
  }
})
</script>

<template>
  <BasePage title="Mes messages" class="max-md:w-full max-md:p-2">
    <div class="flex flex-col md:flex-row w-full gap-2 h-full">
      <!-- Liste des conversations -->
      <div
        class="border rounded-lg w-full md:w-1/3 flex flex-col"
        :class="{ 'max-md:hidden': showMessages }"
      >
        <!-- Bouton de création -->
        <div class="p-2 border-b">
          <NewMessageDialog
            :currentUserId="currentUserId"
            :preselectedUserId="Number(route.query.userId)"
            :autoOpen="true"
            @message-sent="newConversationCreated"
          />
        </div>

        <!-- Liste scrollable -->
        <ScrollArea class="flex-1">
          <ConversationsList
            :conversations="conversations"
            :selectedConversation="selectedConversation"
            :isLoading="isLoadingConversations"
            @selectConversation="selectConversation"
          />
        </ScrollArea>
      </div>

      <!-- Liste des messages -->
      <div
        class="md:flex flex-col w-full md:w-2/3 h-full"
        :class="{ 'max-md:hidden': !showMessages }"
      >
        <!-- Header mobile pour les messages -->
        <div v-if="isMobile && selectedConversation" class="flex items-center gap-2 p-4 md:hidden">
          <Button variant="ghost" size="icon" @click="goBackToConversations">
            <ChevronLeft class="h-6 w-6" />
          </Button>
          <Avatar class="size-8 bg-primary">
            <AvatarImage
              v-if="selectedConversation.picture"
              :src="selectedConversation.picture"
              :alt="selectedConversation.username"
            />
            <AvatarFallback v-else>
              {{ selectedConversation.username?.charAt(0).toUpperCase() ?? 'U' }}
            </AvatarFallback>
          </Avatar>
          <h2 class="font-medium">
            {{ selectedConversation.username }}
          </h2>
        </div>

        <!-- Messages et input -->

        <div class="flex flex-col h-full">
          <MessagesList
            ref="messagesListRef"
            :messages="messages"
            :isLoading="isLoadingMessages"
            :selectedConversationId="selectedConversation?.id"
            :currentUserId="currentUserId"
            class="flex-1"
          />

          <div class="mt-2">
            <SendMessageInput v-if="selectedConversation" @send-message="handleSendMessage" />
          </div>
        </div>
      </div>
    </div>
  </BasePage>
</template>

<style scoped>
.max-md\:hidden {
  transition: all 0.3s ease-in-out;
}
</style>
