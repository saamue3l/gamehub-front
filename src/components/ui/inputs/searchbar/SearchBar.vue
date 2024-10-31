<script setup lang="ts">
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-vue-next'
import { ref, useTemplateRef } from 'vue'

const model = defineModel()
const input: ref = useTemplateRef('input')

interface InputProps {
  placeholder?: string
}

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  model.value = target.value
}

withDefaults(defineProps<InputProps>(), {
  placeholder: 'Rechercher...'
})
</script>

<template>
  <div class="relative w-full max-w-sm items-center">
    <Input
      id="search"
      type="text"
      :placeholder="placeholder"
      class="pl-10"
      @input="onInput"
      ref="input"
      v-model="model"
    />
    <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
      <Search class="size-6 text-muted-foreground" />
    </span>
  </div>
</template>
