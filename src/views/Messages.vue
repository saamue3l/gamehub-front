<script setup lang="ts">
import { onMounted, ref, nextTick, onUnmounted } from 'vue'
import BasePage from '@/components/layout/BasePage.vue';
import MessagesList from '@/components/ui/message/MessagesList.vue';
import SendMessageInput from '@/components/messages/SendMessageInput.vue';
import { httpBackend } from '@/lib/utils';
import NewMessageDialog from '@/components/ui/dialog/NewMessageDialog.vue';
import ConversationsList from '@/components/messages/ConversationsList.vue';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useRoute } from 'vue-router';

const conversations = ref([]);
const selectedConversation = ref(null);
const messages = ref([]);
const currentUserId = ref(null);
const messagesListRef = ref(null);

// Etats pour gérer les chargements
const isLoadingConversations = ref(true);
const isLoadingMessages = ref(false);

async function fetchCurrentUser() {
  try {
    currentUserId.value = await httpBackend('/api/currentUser', 'GET');
    subscribeToUserChannel();
  } catch (error) {
    console.error('Erreur lors du chargement de l��utilisateur:', error);
  }
}

onMounted(() => {
  fetchCurrentUser();
  loadConversations();
});

onUnmounted(() => {
  unsubscribeFromUserChannel();
});

async function loadConversations(isFirstLoad = true) {
  if (isFirstLoad) isLoadingConversations.value = true;
  try {
    conversations.value = await httpBackend('/api/conversations/getConversations', 'GET');

    //Sélectionne la première conversation à l'arrivée sur la page
    if (Array.isArray(conversations.value) && conversations.value.length > 0 && isFirstLoad) {
      selectConversation(conversations.value[0]);
    }
  } catch (error) {
    console.error('Erreur lors du chargement des conversations:', error);
  } finally {
    isLoadingConversations.value = false;
  }
}

async function loadMessagesWithConversation(conversationId, isFirstLoad = true) {
  if (isFirstLoad) isLoadingMessages.value = true;
  try {
    messages.value = await httpBackend(`/api/conversations/${conversationId}/getMessages`, 'GET');
  } catch (error) {
    console.error('Erreur lors du chargement des messages:', error);
  } finally {
    isLoadingMessages.value = false;
    await nextTick();
    if (messagesListRef.value?.messagesContainerRef) {
      const messagesContainer = messagesListRef.value.messagesContainerRef;
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }
}

async function sendMessageToConversation(conversationId, senderId, content) {
  try {
    await httpBackend(`/api/conversations/${conversationId}/sendMessage`, 'POST', {
      senderId,
      content,
    });
  } catch (error) {
    console.error('Erreur lors de l’envoi du message:', error);
  }
}

async function handleSendMessage(message) {
  if (selectedConversation.value) {
    await sendMessageToConversation(selectedConversation.value.conversationId, currentUserId.value, message);
    await loadMessagesWithConversation(selectedConversation.value.conversationId, false);
    if (messagesListRef.value) {
      messagesListRef.value.scrollToBottom();
    }
  }
}

function selectConversation(conversation) {
  console.log('Cleaning conversation selected:', conversation);
  conversation.unreadMessages = 0;
  if (conversation !== selectedConversation.value) {
    messages.value = [];
    selectedConversation.value = conversation;
    loadMessagesWithConversation(conversation.conversationId);
  }
}

function newConversationCreated(conversation) {
  loadConversations(false);
  selectConversation(conversation);
}

function subscribeToUserChannel() {
  const pusher = (window as any).pusher;
  console.log('Pusher instance:', pusher);
  if (pusher) {
    pusher.unsubscribe('user.' + currentUserId.value);
    const channel = pusher.subscribe('user.' + currentUserId.value);
    channel.bind('App\\Events\\MessageSent', (data) => {
      handleNewMessageEvent(data);
    });
  } else {
    console.error('Pusher instance not found');
  }
}

function unsubscribeFromUserChannel() {
  const pusher = (window as any).pusher;
  if (pusher) {
    pusher.unsubscribe('user.' + currentUserId.value);
    console.log('Unsubscribed from channel: user.' + currentUserId.value);
  }
}

function handleNewMessageEvent(data) {
  //Mettre la conversation concernée par la notification en haut de la liste des conversations. Si elle n'existe pas, l'ajouter en récupérant le , la mettre en haut de la liste et appeler loadMessagesWithConversation(notificationConversationId)


  // Si conversation déjà sélectionné, actualisation des messages
  if (selectedConversation.value?.conversationId === data.conversationId) {
    console.log("No need to increment...");
    loadMessagesWithConversation(data.conversationId, false);
  } else {
    loadConversations(false);
    console.log('Conversation selected id : ', selectedConversation.value?.conversationId, "Notification conversation id : ", data.conversationId);
    //Incrémenter de 1 le nombre de messages non lus (unreadMessages) de la conversation concernée par la notificationConversationId dans la liste des conversations
    const conversationToUpdate = conversations.value.find((c) => c.conversationId === data.conversationId);
    conversationToUpdate.unreadMessages++;
  }

}

const route = useRoute();
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