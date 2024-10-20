<template>
  <Badge
    variant="secondary"
    :class="[
      'inline-flex items-center mb-2 mr-2 pl-0.5 pr-1 relative group',
      { 'cursor-pointer': copyable }
    ]"
    @click="copyable ? copyToClipboard() : undefined"
  >
    <img :src="iconUrl" :alt="username" class="h-6" />
    <p class="whitespace-nowrap text-custom-white text-xs font-medium ml-1 mr-1">{{ username }}</p>
    <span
      v-if="isCopied"
      class="absolute left-1/2 -translate-x-1/2 w-full flex justify-center items-center whitespace-nowrap h-full bg-black bg-opacity-90 text-white text-xs py-1 px-2 rounded-3xl pointer-events-none transition-opacity duration-300"
      :class="{ 'opacity-0': !isCopied, 'opacity-100': isCopied }"
    >
      Copié !
    </span>
  </Badge>
</template>

<script setup lang="ts">
import { defineProps, ref } from 'vue'
import { Badge } from '@/components/ui/badge'

const props = defineProps<{
  iconUrl: string
  username: string
  copyable: boolean
}>()

const isCopied = ref(false)

const copyToClipboard = async () => {
  if (!props.copyable) return

  try {
    await navigator.clipboard.writeText(props.username)
    isCopied.value = true
    setTimeout(() => {
      isCopied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy text: ', err)
  }
}
</script>