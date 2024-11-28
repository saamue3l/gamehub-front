<script setup lang="ts">
import { defineProps, ref, defineExpose, watch, nextTick } from 'vue'
import MessageBox from '@/components/ui/message/MessageBox.vue'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'

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

const scrollAreaRef = ref(null)

watch(
  () => props.messages,
  async () => {
    await nextTick()
    scrollToBottom()
  },
  { deep: true }
)

const scrollToBottom = () => {
  if (scrollAreaRef.value) {
    const scrollContainer = scrollAreaRef.value.$el.querySelector(
      '[data-radix-scroll-area-viewport]'
    )
    if (scrollContainer) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight
    }
  }
}

const skeletonCount = ref(5)
const messagesContainerRef = ref(null)

defineExpose({
  scrollToBottom,
  messagesContainerRef
})
</script>

<template>
  <div class="border pr-0 rounded-lg">
    <ScrollArea class="h-96" ref="scrollAreaRef">
      <div v-if="isLoading" class="space-y-4 p-4">
        <div
          v-for="i in skeletonCount"
          :key="i"
          class="flex w-full"
          :class="i % 2 === 0 ? 'justify-end' : 'justify-start'"
        >
          <div
            class="flex flex-col max-w-[75%] space-y-2"
            :class="i % 2 === 0 ? 'items-end' : 'items-start'"
          >
            <Skeleton class="h-4 w-20" />
            <Skeleton
              class="h-12 w-64 rounded-2xl"
              :class="i % 2 === 0 ? 'rounded-br-sm' : 'rounded-bl-sm'"
            />
          </div>
        </div>
      </div>

      <MessageBox
        v-for="message in messages"
        :key="message.id"
        :message="message"
        :selectedConversationId="selectedConversationId"
        :currentUserId="currentUserId"
      />
    </ScrollArea>
  </div>
</template>
