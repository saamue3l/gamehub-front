<script setup lang="ts">
import { ref } from 'vue';
import BasePage from '@/components/layout/BasePage.vue';
import { Button } from '@/components/ui/button';
import List from '@/components/ui/list/List.vue';
import MessageBox from '@/components/ui/message-box/MessageBox.vue';
import NewMessageDialog from '@/components/ui/dialog/NewMessageDialog.vue';

const users = ref([
  { id: 1, name: 'User 1' },
  { id: 2, name: 'User 2' },
  { id: 3, name: 'User 3' },
  { id: 4, name: 'User 4' },
  // Add more users as needed
]);

const selectedUser = ref(users.value[0]);
const messages = ref([
  { from: 'User 1', content: 'Hello!', senderId: 1, recipientId: 2, created_at: '2023-10-01T10:00:00Z' },
  { from: 'Me', content: 'Hi there!', senderId: 2, recipientId: 1, created_at: '2023-10-01T10:05:00Z' },
  { from: 'Me', content: 'How are you?', senderId: 2, recipientId: 1, created_at: '2023-10-01T10:10:00Z' },
  { from: 'User 1', content: 'I am good, thanks!', senderId: 1, recipientId: 2, created_at: '2023-10-01T10:15:00Z' },
  // Add more messages as needed
]);

const isDialogOpen = ref(false);

function selectUser(user) {
  selectedUser.value = user;
  // Load messages for the selected user
}

function openDialog() {
  isDialogOpen.value = true;
}

function closeDialog() {
  isDialogOpen.value = false;
}
</script>

<template>
  <BasePage title="Mes messages">
    <div class="flex">
      <!-- Left Side -->
      <div class="w-1/3 border-r border-gray-300 p-4">
        <NewMessageDialog v-model:open="isDialogOpen" @close="closeDialog" />
        <div class="mb-4"></div> <!-- Add margin bottom to create space -->
        <div class="max-h-96 overflow-y-auto"> <!-- Add max height and scroll -->
          <List :items="users" :selectedUser="selectedUser" @click="selectUser">
            <template #default="{ item }">
              <div class="my-0.5">{{ item.name }}</div>
            </template>
          </List>
        </div>
      </div>

      <!-- Right Side - Messages History -->
      <div class="w-2/3 p-4">
        <div class="max-h-96 overflow-y-auto"> <!-- Add max height and scroll -->
          <MessageBox v-for="message in messages" :key="message.content" :message="message" :selectedUserId="selectedUser.id" :currentUserId="2" class="py-2" /> <!-- Use padding instead of margin -->
        </div>
      </div>
    </div>
  </BasePage>
</template>

<style scoped>
/* Add any necessary styles here */
</style>