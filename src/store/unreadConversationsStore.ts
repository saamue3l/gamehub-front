// src/store/unreadMessagesStore.ts
import { defineStore } from 'pinia';

export const UnreadMessagesStore = defineStore('unreadMessages', {
  state: () => ({
    count: 0,
  }),
  actions: {
    setCount(newCount) {
      this.count = newCount;
    },
  },
});