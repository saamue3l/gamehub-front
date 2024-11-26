<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import BasePage from '@/components/layout/BasePage.vue'
import MessageBox from '@/components/ui/message-box/MessageBox.vue'
import SendMessageInput from '@/components/messages/SendMessageInput.vue'
import { httpBackend } from '@/lib/utils'
import NewMessageDialog from '@/components/ui/dialog/NewMessageDialog.vue'
import UserList from '@/components/messages/UserList.vue'
import Skeleton from '@/components/ui/skeleton/Skeleton.vue'

const users = ref([])
const selectedUser = ref(null)
const messages = ref([])
//const showConversation = ref(false)
const currentUserId = ref(null)

// Etats pour gérer les chargements
const isLoadingConversations = ref(true);
const isLoadingMessages = ref(false);

async function fetchCurrentUser() {
  try {
    currentUserId.value = await httpBackend('/api/currentUser', 'GET')
  } catch (error) {
    console.error('Erreur lors du chargement de l’utilisateur:', error)
  }
}

onMounted(fetchCurrentUser)

async function loadConversationUsers() {
  isLoadingConversations.value = true; // Début du chargement
  try {
    users.value = await httpBackend('/api/userConversations', 'GET');
    console.log(users.value);
  } catch (error) {
    console.error('Erreur lors du chargement des utilisateurs:', error);
  } finally {
    isLoadingConversations.value = false; // Fin du chargement
  }
}

async function loadMessagesWithUser(receiverId) {
  isLoadingMessages.value = true; // Début du chargement
  try {
    messages.value = await httpBackend(`/api/messages/${receiverId}`, 'GET');
  } catch (error) {
    console.error('Erreur lors du chargement des messages:', error);
  } finally {
    isLoadingMessages.value = false; // Fin du chargement
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
    console.error('Erreur lors du chargement des messages:', error)
  }
}

function handleSendMessage(message) {
  if (selectedUser.value) {
    sendMessageToUser(selectedUser.value.id, 1, message)
    loadConversationUsers();
    loadMessagesWithUser(selectedUser.value.id);
  }
}

function selectUser(user) {
  if (user !== selectedUser.value) {
    messages.value = [];
    selectedUser.value = user
    //showConversation.value = window.innerWidth <= 768
    loadMessagesWithUser(user.id)
  }

}

function newConversationCreated(user) {
  loadConversationUsers();
  selectUser(user);
}

onMounted(loadConversationUsers)

watch(selectedUser, (newUser) => {
  if (newUser) loadMessagesWithUser(newUser.id)
})
</script>

<template>
  <BasePage title="Mes messages">
    <div class="flex flex-col md:flex-row w-full">

      <!-- Liste des conversation -->
      <div class="w-full md:w-1/3 md:border-r border-gray-300 p-4">
        <NewMessageDialog @message-sent="newConversationCreated"/>
        <div class="mb-4"></div>

        <!-- Skeleton pendant le chargement des conversations -->
        <UserList :users="users" :selectedUser="selectedUser" :isLoading="isLoadingConversations" @selectUser="selectUser" />

      </div>

      <!-- Affichage des conversations -->
      <div class="block md:hidden w-full md:w-2/3 p-4">
        <div class="flex items-center space-x-2 mb-4">
          <h2 class="text-xl font-bold" v-if="selectedUser && selectedUser.username">
            {{ selectedUser.username }}
          </h2>
        </div>

        <!-- Skeleton pendant le chargement des messages -->
        <div v-show="isLoadingMessages">
          <Skeleton class="w-full h-6 mb-4" v-for="i in 5" :key="i" />
        </div>

        <!-- Affichage des messages -->
        <div v-show="!isLoadingMessages" class="max-h-96 overflow-y-auto">
          <MessageBox
            v-for="message in messages"
            :key="message.content"
            :message="message"
            :selectedUserId="selectedUser.id"
            :currentUserId="currentUserId"
            class="py-2"
          />
        </div>
        <SendMessageInput @send-message="handleSendMessage" />
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
