<template>
  <DropdownMenu v-slot="{ open }">
    <DropdownMenuTrigger as-child>
      <div :class="['flex items-center cursor-pointer hover:bg-secondary hover:rounded-3xl p-0.5', { 'pointer-events-none': open }]">
        <div class="flex items-center">
          <Avatar class="size-8">
            <AvatarImage src="src/assets/joachim.jpg" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <span class="ml-1 mr-1 text-sm font-medium">Pseudo</span>
        </div>
      </div>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-36">
      <DropdownMenuItem @click="goToProfile">
        <User class="mr-2 h-4 w-4" />
        <span>Profile</span>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Settings class="mr-2 h-4 w-4" />
        <span>Settings</span>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <LogOut class="mr-2 h-4 w-4" />
        <span>Log out</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  LogOut,
  Settings,
  User,
} from 'lucide-vue-next'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

const router = useRouter()

const goToProfile = () => {
  router.push({ name: 'Profil' })
}
</script>

<style scoped>
.flex.items-center {
  display: flex !important;
  align-items: center !important;
}
</style>