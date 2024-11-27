<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import BasePage from '@/components/layout/BasePage.vue'
import MessagesList from '@/components/ui/message/MessagesList.vue'
import SendMessageInput from '@/components/messages/SendMessageInput.vue'
import { httpBackend } from '@/lib/utils'
import NewMessageDialog from '@/components/ui/dialog/NewMessageDialog.vue'
import UserList from '@/components/messages/UserList.vue'

const users = ref([])
const usersTempList = ref([])
const selectedUser = ref(null)
const messages = ref([])
const currentUserId = ref(null)

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
onMounted(loadConversationUsers)

async function loadConversationUsers(isFirstLoad = true) {
  if (isFirstLoad) isLoadingConversations.value = true // Début du chargement
  try {
    usersTempList.value = await httpBackend('/api/userConversations', 'GET')
    users.value = usersTempList.value;
  } catch (error) {
    console.error('Erreur lors du chargement des utilisateurs:', error)
  } finally {
    isLoadingConversations.value = false // Fin du chargement
  }
}

async function loadMessagesWithUser(receiverId) {
  try {
    messages.value = await httpBackend(`/api/messages/${receiverId}`, 'GET')
    //console.log('Messages chargés:', messages.value);
  } catch (error) {
    console.error('Erreur lors du chargement des messages:', error)
  } finally {
    isLoadingMessages.value = false // Fin du chargement
  }
}

async function sendMessageToUser(receiverId, userId, message) {
  try {
    await httpBackend(`/api/sendMessage`, 'POST', {
      recipientId: receiverId,
      userId: userId,
      content: message
    })
  } catch (error) {
    console.error('Erreur lors de l’envoi du message:', error)
  }
}

function handleSendMessage(message) {
  if (selectedUser.value) {
    sendMessageToUser(selectedUser.value.id, 1, message)
    loadConversationUsers(false)
    loadMessagesWithUser(selectedUser.value.id)
  }
}

function selectUser(user) {
  if (user !== selectedUser.value) {
    isLoadingMessages.value = true // Début du chargement
    messages.value = []
    selectedUser.value = user
    loadMessagesWithUser(user.id)
  }
}

function newConversationCreated(user) {
  loadConversationUsers(false)
  selectUser(user)
}
</script>

<template>
  <BasePage title="Mes messages">
    <div class="flex flex-col md:flex-row w-full">

      <!-- Liste des conversation -->
      <div class="w-full md:w-1/3 md:border-r border-gray-300 p-4">
        <NewMessageDialog @message-sent="newConversationCreated"/>
        <div class="mb-4"></div>

        <UserList :users="users" :selectedUser="selectedUser" :isLoading="isLoadingConversations" @selectUser="selectUser" />

      </div>

      <!-- Affichage des conversations -->
      <div class="block md:hidden w-full md:w-2/3 p-4">
        <div class="flex items-center space-x-2 mb-4">
          <h2 class="text-xl font-bold" v-if="selectedUser && selectedUser.username">
            {{ selectedUser.username }}
          </h2>
        </div>

        <!-- Affichage des messages -->
        <div class="max-h-96 overflow-y-auto">
          <MessagesList
            :messages="messages"
            :isLoading="isLoadingMessages"
            :selectedUserId="selectedUser?.id"
            :currentUserId="currentUserId"
          />
        </div>
        <SendMessageInput @send-message="handleSendMessage" />
      </div>

      <div class="hidden md:block w-full md:w-2/3 p-4">
        <h2 class="text-xl font-bold mb-4" v-if="selectedUser && selectedUser.username">
          {{ selectedUser.username }}
        </h2>
        <div class="max-h-96 overflow-y-auto">
          <MessagesList
            :messages="messages"
            :isLoading="isLoadingMessages"
            :selectedUserId="selectedUser?.id"
            :currentUserId="currentUserId"
          />
        </div>
        <SendMessageInput @send-message="handleSendMessage" v-if="selectedUser" />
      </div>
    </div>
  </BasePage>
</template>

<style scoped></style>
