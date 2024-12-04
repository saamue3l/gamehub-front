<script setup lang="ts">
import { ref, watch } from 'vue'
import { textToMedia } from '@/lib/textWithMedia'

const props = defineProps<{
  content: string
}>()

const parsedContent = ref('')

watch(
  () => props.content,
  async (newContent) => {
    parsedContent.value = await parseContent(newContent)
  },
  { immediate: true }
)

async function parseContent(content: string): Promise<string> {
  const urlRegex = /(https?:\/\/[^\s]+)/g
  return await replaceAsync(content, urlRegex, textToMedia)
}

async function replaceAsync(str: string, regex: string | RegExp, asyncFn: Function) {
  const promises: Promise<string>[] = []
  str.replace(regex, (full, ...args) => {
    promises.push(asyncFn(full, ...args))
    return full
  })
  const data = await Promise.all(promises)
  return str.replace(regex, () => data.shift())
}
</script>

<template>
  <div v-html="parsedContent" class="whitespace-pre-wrap"></div>
</template>
