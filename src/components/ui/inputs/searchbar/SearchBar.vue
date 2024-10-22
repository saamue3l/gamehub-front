<script setup lang="ts">
import SearchButton from '@/components/ui/inputs/searchbar/SearchButton.vue'

interface InputProps {
  placeholder?: string
}

withDefaults(defineProps<InputProps>(), {
  placeholder: 'Rechercher'
})
</script>
<template>
  <div
    class="group/search rounded-md p-1.5 flex justify-start bg-custom-background border border-custom-white focus-within:border-custom-primary"
    tabindex=""
  >
    <input
      :placeholder="placeholder"
      class="bg-custom-background focus-visible:outline-none focus-visible:placeholder-custom-white transition placeholder:transition placeholder:text-custom-gray caret-custom-white text-custom-white"
    />
    <SearchButton></SearchButton>
  </div>
</template>
<style scoped></style>
