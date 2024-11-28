<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue'
import BasePage from '@/components/layout/BasePage.vue'
import MessagesList from '@/components/ui/message/MessagesList.vue'
import SendMessageInput from '@/components/messages/SendMessageInput.vue'
import { httpBackend } from '@/lib/utils'
import NewMessageDialog from '@/components/ui/dialog/NewMessageDialog.vue'
import ConversationsList from '@/components/messages/ConversationsList.vue'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useRoute } from 'vue-router'
import { PusherStore } from '@/store/pusherStore'

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
    loadMessagesWithConversation(conversation.conversationId)
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
  console.log("Message reçu... Voici l'id de la conversation sélectionneé : ", selectedConversation.value?.conversationId);
}


const route = useRoute()
</script>

<template>
  <BasePage title="Mes messages" class="max-md:w-full max-md:p-2">
    <div class="flex flex-col md:flex-row w-full gap-2">
      <div class="border rounded-lg w-full md:w-1/3">
        <div class="p-2 border-b">
          <NewMessageDialog
            :currentUserId="currentUserId"
            :preselectedUserId="Number(route.query.userId)"
            :autoOpen="true"
            @message-sent="newConversationCreated"
          />
        </div>
        <ScrollArea class="h-96">
          <ConversationsList
            :conversations="conversations"
            :selectedConversation="selectedConversation"
            :isLoading="isLoadingConversations"
            @selectConversation="selectConversation"
          />
        </ScrollArea>
      </div>
      <div class="md:flex flex-col w-full md:w-2/3">
        <div class="flex flex-col flex-grow">
          <MessagesList
            ref="messagesListRef"
            :messages="messages"
            :isLoading="isLoadingMessages"
            :selectedConversationId="selectedConversation?.id"
            :currentUserId="currentUserId"
            class="flex-grow"
          />
        </div>
        <SendMessageInput
          @send-message="handleSendMessage"
          v-if="selectedConversation"
          class="mt-2"
        />
      </div>
    </div>
  </BasePage>
</template>