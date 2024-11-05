<script setup lang="ts">
import { defineProps, computed } from 'vue';

const props = defineProps({
  message: {
    type: Object,
    required: true,
  },
  selectedUserId: {
    type: Number,
    required: true,
  },
  currentUserId: {
    type: Number,
    required: true,
  },
});

const isSentByMe = computed(() => props.message.senderId === props.currentUserId);
const isReceived = computed(() => props.message.senderId === props.selectedUserId);
</script>

<template>
  <div :class="['message-box !py-0.5', { 'sent': isSentByMe, 'received': isReceived }]">
    <div class="message-header">
      <span>{{ message.from }}</span> - <span>{{ new Date(message.created_at).toLocaleString() }}</span>
    </div>
    <div class="message-content">
      {{ message.content }}
    </div>
  </div>
</template>

<style scoped>
.message-box {
  padding: 0.5rem;
  border-radius: 10px;
  margin-bottom: 0.5rem;
  max-width: 60%;
  word-wrap: break-word;
  display: flex;
  flex-direction: column;
}

.message-header {
  font-size: 0.75rem;
  font-style: italic;
}

.message-content {
  margin-top: 0rem;
}

.message-timestamp {
  font-size: 0.75rem;
  font-style: italic;
  color: #d3d3d3;
}

.sent {
  background-color: #3b82f6; /* Shadcn blue */
  color: black;
  align-self: flex-end;
  text-align: right;
  margin-left: auto; /* Align to the right */
}

.sent .message-header,
.sent .message-timestamp {
  text-align: right;
}

.received {
  background-color: white;
  color: black;
  align-self: flex-start;
  text-align: left;
  margin-right: auto; /* Align to the left */
}

.received .message-header,
.received .message-timestamp {
  text-align: left;
}
</style>