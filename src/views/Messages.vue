<script setup lang="ts">
import { onMounted, ref, nextTick } from 'vue'
import BasePage from '@/components/layout/BasePage.vue'
import MessagesList from '@/components/ui/message/MessagesList.vue'
import SendMessageInput from '@/components/messages/SendMessageInput.vue'
import { httpBackend } from '@/lib/utils'
import NewMessageDialog from '@/components/ui/dialog/NewMessageDialog.vue'
import UserList from '@/components/messages/UserList.vue'

const users = ref([])
const selectedUser = ref(null)
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
onMounted(loadConversationUsers)

async function loadConversationUsers(isFirstLoad = true) {
  if (isFirstLoad) isLoadingConversations.value = true // Début du chargement
  try {
    users.value = await httpBackend('/api/userConversations', 'GET')
    if (users.value.length > 0) selectUser(users.value.at(0));
  } catch (error) {
    console.error('Erreur lors du chargement des utilisateurs:', error)
  } finally {
    isLoadingConversations.value = false // Fin du chargement
  }
}

async function loadMessagesWithUser(receiverId, isFirstLoad = true) {
  if (isFirstLoad) isLoadingMessages.value = true // Début du chargement
  console.log("isFirstLoad : ", isFirstLoad)
  try {
    messages.value = await httpBackend(`/api/messages/${receiverId}`, 'GET')
  } catch (error) {
    console.error('Erreur lors du chargement des messages:', error)
  }  finally {
    isLoadingMessages.value = false // Fin du chargement
    await nextTick();
    if (messagesListRef.value?.messagesContainerRef) {
      const messagesContainer = messagesListRef.value.messagesContainerRef;
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }
}

async function sendMessageToUser(receiverId, userId, message) {
  try {
    await httpBackend(`/api/sendMessage`, 'POST', {
      recipientId: receiverId,
      userId: userId,
      content: message
    })
    console.log("sendMessageToUser : Message envoyé avec succès !")
  } catch (error) {
    console.error('Erreur lors de l’envoi du message:', error)
  }
}

function handleSendMessage(message) {
  if (selectedUser.value) {
    console.log("handleSendMessage : ", message)
    sendMessageToUser(selectedUser.value.id, 1, message)
    //loadConversationUsers(false)
    loadMessagesWithUser(selectedUser.value.id, false)
  }
}

function selectUser(user) {
  if (user !== selectedUser.value) {
    messages.value = []
    selectedUser.value = user
    loadMessagesWithUser(user.id)
  }
}

function newConversationCreated(user) {
  loadConversationUsers(false)
  selectUser(user) //Implique un appel à loadMessagesWithUser en nouvelle conv
}

</script>

<template>
  <BasePage title="Mes messages">

    <div class="flex flex-col md:flex-row w-full">

      <!-- Liste des conversation/utilisateurs -->
      <div class="w-full md:w-1/3 md:border-r border-gray-300 p-4">

        <!-- Bouton de création d'une nouvelle conversation -->
        <NewMessageDialog @message-sent="newConversationCreated"/>
        <div class="mb-4"></div>

        <!-- Liste des utilisateurs avec qui une conv existe -->
        <UserList :users="users" :selectedUser="selectedUser" :isLoading="isLoadingConversations" @selectUser="selectUser" />
      </div>

      <!-- Liste des messages -->
      <div class="md:flex flex-col w-full md:w-2/3 p-4">
        <h2 class="text-xl font-bold mb-4" v-if="selectedUser && selectedUser.username">
          {{ selectedUser.username }}
        </h2>
        <div class="flex flex-col flex-grow">
          <MessagesList
            ref="messagesListRef"
            :messages="messages"
            :isLoading="isLoadingMessages"
            :selectedUserId="selectedUser?.id"
            :currentUserId="currentUserId"
            class="flex-grow pr-2"
          />
        </div>
        <SendMessageInput @send-message="handleSendMessage" v-if="selectedUser" class="mt-1 mb-1" />
      </div>
    </div>

  </BasePage>
</template>

<style scoped></style>
