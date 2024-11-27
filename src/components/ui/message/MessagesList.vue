<script setup lang="ts">
import { defineProps, ref } from 'vue'
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
  selectedUserId: {
    type: Number,
    required: true
  },
  currentUserId: {
    type: Number,
    required: true
  }
})

const skeletonCount = ref(5) // Nombre de skeletons à afficher
</script>

<template>
  <div class="max-h-96 overflow-y-auto">
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
      :selectedUserId="selectedUserId"
      :currentUserId="currentUserId"
    />
  </div>
</template>

<style scoped></style>
