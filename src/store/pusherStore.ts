// stores/pusherStore.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import Pusher from 'pusher-js';
import { httpBackend } from '@/lib/utils'

let pusherInstance: Pusher | null = null;

export const PusherStore = defineStore('pusherStore', () => {
  const subscribedChannels = ref<Set<string>>(new Set());
  const eventHandlers = ref<Map<string, ((data: any) => void)[]>>(new Map());

  // Initialize Pusher instance (same as before)
  if (!pusherInstance) {
    pusherInstance = new Pusher(import.meta.env.VITE_APP_PUSHER_APP_KEY, {
      cluster: import.meta.env.VITE_APP_PUSHER_APP_CLUSTER,
      encrypted: true,
      forceTLS: true,
    });
  }

  const subscribeToUserChannel = (userId: string) => {
    console.log("DEMANDE DE SUBSCRIBE RECUE :");
    subscribedChannels.value.forEach(channel => console.log("Voici un channel : ", channel));
    const channelName = `user.${userId}`;
    if (subscribedChannels.value.has(channelName)) {
      console.warn(`Already subscribed to channel: ${channelName}`);
      return;
    }

    const channel = pusherInstance?.subscribe(channelName);
    if (!channel) {
      console.error(`Failed to subscribe to channel: ${channelName}`);
      return;
    }

    subscribedChannels.value.add(channelName);
    console.log(`Subscribed to channel: ${channelName}`);

    // Bind all registered event handlers to the new channel
    eventHandlers.value.forEach((handlers, eventName) => {
      handlers.forEach(handler => {
        channel.bind(eventName, handler);
        console.log(`Event ${eventName} bound to channel: ${channelName}`);
      });
    });
  };

  const registerEventHandler = (eventName: string, handler: (data: any) => void) => {
    if (!eventHandlers.value.has(eventName)) {
      eventHandlers.value.set(eventName, []);
      fetchUnreadConversationsCount()
    }

    const existingHandlers = eventHandlers.value.get(eventName) || [];

    // Prevent duplicate handlers
    if (!existingHandlers.includes(handler)) {
      existingHandlers.push(handler);
      eventHandlers.value.set(eventName, existingHandlers);
    }

    // Bind to existing channels
    subscribedChannels.value.forEach(channelName => {
      const channel = pusherInstance?.channel(channelName);
      if (channel) {
        channel.bind(eventName, handler);
        console.log(`Event ${eventName} bound to channel: ${channelName}`);
      }
    });
  };

  const unreadConversationsCount = ref(0)

  // Méthode pour récupérer le nombre de conversations non lues
  async function fetchUnreadConversationsCount() {
    try {
      unreadConversationsCount.value = await httpBackend('/api/conversations/getUnreadConversations', 'GET')
    } catch (error) {
      console.error('Erreur lors de la récupération des conversations non lues:', error)
      unreadConversationsCount.value = 0
    }
  }

  return {
    pusherInstance,
    subscribeToUserChannel,
    registerEventHandler,
    unreadConversationsCount,
    fetchUnreadConversationsCount
  };
});