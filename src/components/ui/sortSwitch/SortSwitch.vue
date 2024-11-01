<script setup lang="ts">
import ChevronDownIcon from '@/components/icons/chevronDownIcon.vue'
import { Button, type ButtonVariants } from '@/components/ui/button'

const model = defineModel({ type: Boolean, default: false })

interface Props {
  placeholder: string
  buttonVariant?: ButtonVariants['variant']
}

withDefaults(defineProps<Props>(), {
  buttonVariant: 'default'
})
</script>

<template>
  <Button :variant="buttonVariant" @click="() => (model = !model)">
    {{ placeholder }}
    <ChevronDownIcon :class="{ 'ml-2 h-4 w-4 transition': true, 'rotate-180': model }" />
  </Button>
</template>

<style scoped></style>
