<script setup lang="ts">
import { type HTMLAttributes, ref, watch } from 'vue'
import { textToMedia } from '@/lib/textWithMedia'

const props = withDefaults(
  defineProps<{
    content: string
    className?: HTMLAttributes['class']
  }>(),
  {
    className: ''
  }
)

const parsedContent = ref(props.content)

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
    promises.push(asyncFn(full, props.className, ...args))
    return full
  })
  const data = await Promise.all(promises)
  return str.replace(regex, () => data.shift())
}
</script>

<template>
  <div v-html="parsedContent" class="whitespace-pre-wrap"></div>
</template>
