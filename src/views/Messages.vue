<script setup lang="ts">
import { ref } from 'vue'
import BasePage from '@/components/layout/BasePage.vue'
import List from '@/components/ui/list/List.vue'
import MessageBox from '@/components/ui/message-box/MessageBox.vue'
import NewMessageDialog from '@/components/ui/dialog/NewMessageDialog.vue'
import SendMessageInput from '@/components/messages/SendMessageInput.vue'

const users = ref([
  { id: 1, name: 'User 1' },
  { id: 2, name: 'User 2' },
  { id: 3, name: 'User 3' },
  { id: 4, name: 'User 4' }
])

const selectedUser = ref(users.value[0])
const messages = ref([
  {
    from: 'User 1',
    content: 'Hello!',
    senderId: 1,
    recipientId: 2,
    created_at: '2023-10-01T10:00:00Z'
  },
  {
    from: 'Me',
    content: 'Hi there!',
    senderId: 2,
    recipientId: 1,
    created_at: '2023-10-01T10:05:00Z'
  },
  {
    from: 'Me',
    content: 'How are you?',
    senderId: 2,
    recipientId: 1,
    created_at: '2023-10-01T10:10:00Z'
  },
  {
    from: 'User 1',
    content: 'I am good, thanks!',
    senderId: 1,
    recipientId: 2,
    created_at: '2023-10-01T10:15:00Z'
  }
])

const isDialogOpen = ref(false)
const showConversation = ref(false)

function selectUser(user) {
  selectedUser.value = user
  const largeurEcran = window.innerWidth

  showConversation.value = largeurEcran <= 768
}

function openDialog() {
  isDialogOpen.value = true
}

function closeDialog() {
  isDialogOpen.value = false
}

function goBackToList() {
  showConversation.value = false
}
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
              <div class="my-0.5">{{ item.name }}</div>
            </template>
          </List>
        </div>
      </div>

      <div class="block md:hidden w-full md:w-2/3 p-4">
        <div v-show="showConversation" class="flex items-center space-x-2 mb-4">
          <button @click="goBackToList" class="md:hidden text-blue-500">←</button>
          <h2 class="text-xl font-bold">{{ selectedUser.name }}</h2>
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
