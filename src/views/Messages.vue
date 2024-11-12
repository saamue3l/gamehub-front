<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import BasePage from '@/components/layout/BasePage.vue'
import List from '@/components/ui/list/List.vue'
import MessageBox from '@/components/ui/message-box/MessageBox.vue'
import SendMessageInput from '@/components/messages/SendMessageInput.vue'
import { httpBackend } from '@/lib/utils'

const users = ref([])
const selectedUser = ref(null)
const messages = ref([])
const showConversation = ref(false)

async function loadConversationUsers() {
  try {
    users.value = await httpBackend('/api/userConversations', 'GET')
    console.log(users.value)
  } catch (error) {
    console.error('Erreur lors du chargement des utilisateurs:', error)
  }
}

async function loadMessagesWithUser(userId) {
  try {
    messages.value = await httpBackend(`/api/messages/${userId}`, 'GET')
  } catch (error) {
    console.error('Erreur lors du chargement des messages:', error)
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
        <div class="max-h-96 overflow-y-auto">
          <List :items="users" :selectedUser="selectedUser" @click="selectUser">
            <template #default="{ item }">
              <!-- Vérifiez que item et item.username existent avant de les afficher -->
              <div class="my-0.5" v-if="item && item.username">{{ item.username }}</div>
            </template>
          </List>
        </div>
      </div>

      <!-- Conversations -->
      <div class="block md:hidden w-full md:w-2/3 p-4">
        <div v-show="showConversation" class="flex items-center space-x-2 mb-4">
          <button @click="goBackToList" class="md:hidden text-blue-500">←</button>
          <!-- Vérifiez que selectedUser existe avant d'afficher son nom -->
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
            :currentUserId="2"
            class="py-2"
          />
        </div>

        <SendMessageInput v-show="showConversation" />
      </div>

      <div class="hidden md:block w-full md:w-2/3 p-4">
        <div class="max-h-96 overflow-y-auto">
          <MessageBox
            v-for="message in messages"
            :key="message.content"
            :message="message"
            :selectedUserId="selectedUser.id"
            :currentUserId="2"
            :v-if="isSentByMe || isReceived"
            class="py-2"
          />
        </div>

        <SendMessageInput />
      </div>
    </div>
  </BasePage>
</template>

<style scoped></style>
