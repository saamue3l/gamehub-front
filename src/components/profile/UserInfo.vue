<script setup lang="ts">
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'

interface Props {
  avatarSrc?: string
  pseudo: string
  level: number
  progress?: number
}

defineProps<Props>()
</script>

<template>
  <div class="flex mb-4">
    <Avatar class="size-16">
      <AvatarImage :src="avatarSrc" :alt="pseudo" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
    <div class="flex flex-col justify-center space-y-1 ml-2">
      <div class="flex items-center space-x-2">
        <span class="font-medium">{{ pseudo }}</span>
        <div
          class="flex items-center justify-center h-6 w-6 font-bold bg-primary text-primary-foreground rounded-full text-sm"
        >
          {{ level }}
        </div>
      </div>
      <Progress :model-value="progress ?? level" class="w-40 h-2" />
    </div>
  </div>
</template>
<style scoped></style>
