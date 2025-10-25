<template>
  <DropdownMenu v-slot="{ open }">
    <DropdownMenuTrigger as-child>
      <div
        :class="[
          'flex items-center cursor-pointer hover:bg-secondary hover:rounded-3xl p-0.5',
          { 'pointer-events-none': open }
        ]"
      >
        <div class="flex items-center">
          <Avatar v-if="isLoggedIn" class="size-8">
            <AvatarImage
              v-if="userStore.profilePicture && userStore.profilePicture !== 'null'"
              :src="userStore.profilePicture"
              alt="Profile picture"
            />
            <AvatarImage v-else :src="defaultPfp" alt="photo de profil" />
          </Avatar>

          <span class="ml-1 mr-1 text-sm font-medium truncate max-w-20">{{
            userStore.username
          }}</span>
          <!-- Utilisation de username -->
        </div>
      </div>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-36">
      <DropdownMenuItem @click="goToProfile">
        <User class="mr-2 h-4 w-4" />
        <span>Mon profil</span>
      </DropdownMenuItem>
      <DropdownMenuItem @click="editProfile">
        <Settings class="mr-2 h-4 w-4" />
        <span>Paramètres</span>
      </DropdownMenuItem>
      <DropdownMenuItem @click="logout">
        <LogOut class="mr-2 h-4 w-4" />
        <span>Déconnexion</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { LogOut, Settings, User } from 'lucide-vue-next'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { UserStore } from '@/store/userStore'
import { postLogout } from '@/api/postLogout'
import { toast } from '@/components/ui/toast'
import defaultPfp from '@/assets/defaultPfp1.png'

const router = useRouter()
const userStore = UserStore()

const goToProfile = () => {
  router.push({ name: 'Profil', params: { username: userStore.username } })
}

const logout = () => {
  try {
    postLogout()
    userStore.resetStore()
    router.push({ path: '/' })
  } catch (error) {
    toast(
      toast({
        title: "Quelque chose n'a pas fonctionné.",
        description: error.message,
        variant: 'destructive'
      })
    )
  }
}

const editProfile = () => {
  router.push({ name: 'ModificationProfil' })
}

const isLoggedIn = computed(() => !!userStore.username)
</script>

<style scoped>
.flex.items-center {
  display: flex !important;
  align-items: center !important;
}
</style>
