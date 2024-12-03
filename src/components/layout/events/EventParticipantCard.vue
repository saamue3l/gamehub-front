<script setup lang="ts">
import type { User } from '@/types/User'
import UserAvatar from '@/components/layout/user/UserAvatar.vue'
import { Crown } from 'lucide-vue-next'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

withDefaults(
  defineProps<{
    user: User
    isCreator: boolean
    isUser: boolean
  }>(),
  {
    isCreator: false,
    isUser: false
  }
)
</script>

<template>
  <router-link
    :to="{ name: 'Profil', params: { username: user.username } }"
    :class="{
      'text-primary flex justify-around items-center gap-1.5 w-min border hover:bg-secondary rounded-full pr-3 transition': true,
      'bg-primary text-primary-foreground border-primary hover:bg-muted hover:text-muted-foreground':
        isUser
    }"
  >
    <UserAvatar :user="user" />

    <div class="truncate">{{ user.username }}</div>

    <TooltipProvider v-if="isCreator">
      <Tooltip>
        <TooltipTrigger>
          <Crown class="w-4 h-4 text-yellow-500" />
        </TooltipTrigger>
        <TooltipContent> Créateur de l'évènement </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </router-link>
</template>

<style scoped></style>
