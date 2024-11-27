<script setup lang="ts">
import { defineProps, ref, defineExpose } from 'vue'
import MessageBox from '@/components/ui/message/MessageBox.vue'
import Skeleton from '@/components/ui/skeleton/Skeleton.vue'

const props = defineProps({
  messages: {
    type: Array,
    required: true
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  selectedConversationId: {
    type: Number,
    required: true,
    default: 0
  },
  currentUserId: {
    type: Number,
    required: true,
    default: 0
  }
})

const skeletonCount = ref(5) // Nombre de skeletons à afficher
const messagesContainerRef = ref(null)

// Expose the reference to the parent component
defineExpose({
  messagesContainerRef
})
</script>

<template>
  <div ref="messagesContainerRef" class="max-h-96 overflow-y-auto">
    <!-- Skeletons pendant le chargement -->
    <div v-if="isLoading">
      <Skeleton
        v-for="i in skeletonCount"
        :key="i"
        class="w-full h-16 mb-2 rounded-lg bg-gray-300"
      />
    </div>

    <!-- Messages affichés après chargement -->
    <MessageBox
      v-for="message in messages"
      :key="message.id"
      :message="message"
      :selectedConversationId="selectedConversationId"
      :currentUserId="currentUserId"
    />
  </div>
</template>

<style scoped></style>
