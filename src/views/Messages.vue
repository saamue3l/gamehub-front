<script setup lang="ts">
import { ref, nextTick, onMounted, onBeforeUnmount } from 'vue'
import BasePage from '@/components/layout/BasePage.vue'
import MessagesList from '@/components/ui/message/MessagesList.vue'
import SendMessageInput from '@/components/messages/SendMessageInput.vue'
import { httpBackend } from '@/lib/utils'
import NewMessageDialog from '@/components/ui/dialog/NewMessageDialog.vue'
import ConversationsList from '@/components/messages/ConversationsList.vue'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useRoute } from 'vue-router'
import { PusherStore } from '@/store/pusherStore'
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
const pusherStore = PusherStore();

// Etats pour gérer les chargements
const isLoadingConversations = ref(true)
const isLoadingMessages = ref(false)


async function fetchCurrentUser() {
  try {
    currentUserId.value = await httpBackend('/api/currentUser', 'GET')
    pusherStore.registerEventHandler('App\\Events\\MessageSent', handleNewMessageEvent)
  } catch (error) {
    console.error('Erreur lors du chargement de l’utilisateur:', error)
  }
}

onMounted(() => {
  fetchCurrentUser()
  loadConversations()
})

onBeforeUnmount(() => {
  pusherStore.unregisterEventHandler('App\\Events\\MessageSent', handleNewMessageEvent);
});

async function loadConversations(isFirstLoad = true) {
  if (isFirstLoad) isLoadingConversations.value = true
  try {
    conversations.value = await httpBackend('/api/conversations/getConversations', 'GET')
    console.log('Conversations:', conversations.value)
    if (Array.isArray(conversations.value) && conversations.value.length > 0 && isFirstLoad) {
      selectConversation(conversations.value[0])
    }
  } catch (error) {
    console.error('Erreur lors du chargement des conversations:', error)
  } finally {
    isLoadingConversations.value = false
  }
}

async function loadMessagesWithConversation(conversationId, isFirstLoad = true) {
  if (isFirstLoad) isLoadingMessages.value = true
  try {
    messages.value = await httpBackend(`/api/conversations/${conversationId}/getMessages`, 'GET')
  } catch (error) {
    console.error('Erreur lors du chargement des messages de la convId : ', conversationId, error)
  } finally {
    pusherStore.fetchUnreadConversationsCount();
    isLoadingMessages.value = false
    await nextTick()
    if (messagesListRef.value?.messagesContainerRef) {
      const messagesContainer = messagesListRef.value.messagesContainerRef
      messagesContainer.scrollTop = messagesContainer.scrollHeight
    }
  }
}

async function sendMessageToConversation(conversationId, senderId, content) {
  try {
    await httpBackend(`/api/conversations/${conversationId}/sendMessage`, 'POST', {
      senderId,
      content,
    })
  } catch (error) {
    console.error('Erreur lors de l’envoi du message:', error)
  }
  loadConversations(false);
}

async function handleSendMessage(message) {
  if (selectedConversation.value) {
    await sendMessageToConversation(selectedConversation.value.conversationId, currentUserId.value, message)
    await loadMessagesWithConversation(selectedConversation.value.conversationId, false)
    if (messagesListRef.value) {
      messagesListRef.value.scrollToBottom()
    }
  }
}

function selectConversation(conversation) {
  conversation.unreadMessages = 0
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
  loadConversations(false)
  selectConversation(conversation)
}

function handleNewMessageEvent(data) {
  console.log('MESSAGES.VUE Nouvel événement de message:', data)
  if (selectedConversation.value?.conversationId === data.conversationId) {
    loadMessagesWithConversation(data.conversationId, false)
  } else {
    const conversationToUpdate = conversations.value.find((c) => c.conversationId === data.conversationId)
    if (conversationToUpdate) {
      conversationToUpdate.unreadMessages++
    }
    loadConversations(false)
  }
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
  console.log("Message reçu... Voici l'id de la conversation sélectionneé : ", selectedConversation.value?.conversationId);
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
