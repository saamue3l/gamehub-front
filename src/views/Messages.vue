<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import BasePage from '@/components/layout/BasePage.vue'
import MessageBox from '@/components/ui/message-box/MessageBox.vue'
import SendMessageInput from '@/components/messages/SendMessageInput.vue'
import { httpBackend } from '@/lib/utils'
import NewMessageDialog from '@/components/ui/dialog/NewMessageDialog.vue'
import UserList from '@/components/messages/UserList.vue'

const users = ref([])
const selectedUser = ref(null)
const messages = ref([])
const showConversation = ref(false)
const currentUserId = ref(null)

async function fetchCurrentUser() {
  try {
    currentUserId.value = await httpBackend('/api/currentUser', 'GET')
  } catch (error) {
    console.error('Erreur lors du chargement de l’utilisateur:', error)
  }
}

onMounted(fetchCurrentUser)

async function loadConversationUsers() {
  try {
    users.value = await httpBackend('/api/userConversations', 'GET')
    console.log(users.value)
  } catch (error) {
    console.error('Erreur lors du chargement des utilisateurs:', error)
  }
}

async function loadMessagesWithUser(receiverId) {
  try {
    messages.value = await httpBackend(`/api/messages/${receiverId}`, 'GET')
  } catch (error) {
    console.error('Erreur lors du chargement des messages:', error)
  }
}

async function sendMessageToUser(receiverId, userId, message) {
  try {
    console.log(receiverId, userId, message)
    await httpBackend(`/api/sendMessage`, 'POST', {
      recipientId: receiverId,
      userId: userId,
      content: message
    })
  } catch (error) {
    console.error('Erreur lors du chargement des messages:', error)
  }
}

function handleSendMessage(message) {
  if (selectedUser.value) {
    sendMessageToUser(selectedUser.value.id, 1, message)
  }
}

function selectUser(user) {
  selectedUser.value = user
  showConversation.value = window.innerWidth <= 768
  loadMessagesWithUser(user.id)
}

onMounted(loadConversationUsers)

function goBackToList() {
  showConversation.value = false
}

watch(selectedUser, (newUser) => {
  if (newUser) loadMessagesWithUser(newUser.id)
})
</script>

<template>
  <BasePage title="Mes messages">
    <div class="flex flex-col md:flex-row w-full">
      <div v-show="!showConversation" class="w-full md:w-1/3 md:border-r border-gray-300 p-4">
        <NewMessageDialog v-model:open="isDialogOpen" @close="closeDialog" />
        <div class="mb-4"></div>
        <UserList :users="users" :selectedUser="selectedUser" @select-user="selectUser" />
      </div>

      <!-- Conversations -->
      <div class="block md:hidden w-full md:w-2/3 p-4">
        <div v-show="showConversation" class="flex items-center space-x-2 mb-4">
          <button @click="goBackToList" class="md:hidden text-blue-500">←</button>
          <h2 class="text-xl font-bold" v-if="selectedUser && selectedUser.username">
            {{ selectedUser.username }}
          </h2>
        </div>

        <div v-show="showConversation" class="max-h-96 overflow-y-auto">
          <MessageBox
            v-for="message in messages"
            :key="message.content"
            :message="message"
            :selectedUserId="selectedUser.id"
            :currentUserId="currentUserId"
            class="py-2"
          />
        </div>
        <SendMessageInput v-show="showConversation" @send-message="handleSendMessage" />
      </div>

      <div class="hidden md:block w-full md:w-2/3 p-4">
        <h2 class="text-xl font-bold mb-4" v-if="selectedUser && selectedUser.username">
          {{ selectedUser.username }}
        </h2>
        <div class="max-h-96 overflow-y-auto">
          <MessageBox
            v-for="message in messages"
            :key="message.content"
            :message="message"
            :selectedUserId="selectedUser.id"
            :currentUserId="currentUserId"
            class="py-2"
          />
        </div>
        <SendMessageInput @send-message="handleSendMessage" v-if="selectedUser" />
      </div>
    </div>
  </BasePage>
</template>

<style scoped></style>
