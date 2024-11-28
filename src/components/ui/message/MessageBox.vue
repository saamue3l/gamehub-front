<script setup lang="ts">
import { defineProps, computed } from 'vue'
import { format, isToday, isYesterday } from 'date-fns'
import { fr } from 'date-fns/locale'

const props = defineProps({
  message: {
    type: Object,
    required: true
  },
  selectedConversationId: {
    type: Number,
    required: true
  },
  currentUserId: {
    type: Number,
    required: true
  }
})

const isSentByMe = computed(() => props.message.senderId === props.currentUserId)

const formattedDate = computed(() => {
  const messageDate = new Date(props.message.created_at)

  if (isToday(messageDate)) {
    return `Aujourd'hui, ${format(messageDate, 'HH:mm')}`
  }

  if (isYesterday(messageDate)) {
    return `Hier, ${format(messageDate, 'HH:mm')}`
  }

  return format(messageDate, 'dd-MM-yy HH:mm')
})
</script>

<template>
  <div
    class="group flex w-full"
    :class="[isSentByMe ? 'justify-end' : 'justify-start', isSentByMe ? 'pr-2' : 'pl-2', 'mb-2']"
  >
    <div class="flex flex-col max-w-[75%]" :class="isSentByMe ? 'items-end' : 'items-start'">
      <div class="flex items-center gap-2 text-xs text-muted-foreground px-2 mb-1">
        <span>
          {{ formattedDate }}
        </span>
      </div>
      <div
        class="px-4 py-2.5 rounded-2xl text-sm"
        :class="[
          isSentByMe
            ? 'bg-primary text-primary-foreground rounded-br-sm'
            : 'bg-muted rounded-bl-sm',
          { 'rounded-tr-sm': message.showTimestamp }
        ]"
      >
        {{ message.content }}
      </div>
    </div>
  </div>
</template>
