<script setup lang="ts">
import { defineEmits } from 'vue'
import { UserStore } from '@/store/userStore'
import {
  LogOut,
  Settings,
  User,
  Bell,
  ChevronRight,
  MessageSquare,
  CalendarDays,
  MessageCircle,
  UsersRound
} from 'lucide-vue-next'
import { postLogout } from '@/api/postLogout'
import { toast } from '@/components/ui/toast'
import { useRouter } from 'vue-router'
import { PusherStore } from '@/store/pusherStore'
const router = useRouter()

const userStore = UserStore()
const pusherStore = PusherStore()

const emit = defineEmits(['close-sheet'])

const logout = () => {
  try {
    postLogout()
    userStore.resetStore()
    router.push({ path: '/' })
    emit('close-sheet')
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

const goToProfile = () => {
  router.push({ name: 'Profil', params: { username: userStore.username } })
  emit('close-sheet')
}

const editProfile = () => {
  router.push({ name: 'ModificationProfil' })
  emit('close-sheet')
}
</script>

<template>
  <div class="w-full flex flex-col items-start text-foreground pt-5">
    <div class="w-full flex flex-col items-start space-y-2">
      <div class="flex justify-between items-center w-full bg-secondary p-2 rounded-lg">
        <User class="h-6 w-6 text-primary" />
        <a @click="goToProfile" class="text-lg">Mon Profil</a>
        <ChevronRight class="h-6 w-6 text-foreground" />
      </div>
      <!--
      <div class="flex justify-between items-center w-full bg-secondary p-2 rounded-lg">
        <Bell class="h-6 w-6 text-primary" />
        <a href="/notifications" class="text-lg">Notifications</a>
        <ChevronRight class="h-6 w-6 text-foreground" />
      </div>
      -->

      <div class="flex justify-between items-center w-full bg-secondary p-2 rounded-lg">
        <Settings class="h-6 w-6 text-primary" />
        <a @click="editProfile" class="text-lg">Paramètres</a>
        <ChevronRight class="h-6 w-6 text-foreground" />
      </div>
    </div>

    <hr class="my-4 border-gray-600 w-full" />

    <div class="w-full flex flex-col items-start space-y-2">
      <div class="flex justify-between items-center w-full bg-secondary p-2 rounded-lg">
        <UsersRound class="h-6 w-6 text-primary" />
        <a href="/matchmaking" class="text-lg">Matchmaking</a>
        <ChevronRight class="h-6 w-6 text-foreground" />
      </div>

      <div class="flex justify-between items-center w-full bg-secondary p-2 rounded-lg">
        <CalendarDays class="h-6 w-6 text-primary" />
        <a href="/events" class="text-lg">Évènements</a>
        <ChevronRight class="h-6 w-6 text-foreground" />
      </div>

      <div class="flex justify-between items-center w-full bg-secondary p-2 rounded-lg">
        <MessageCircle class="h-6 w-6 text-primary" />
        <a href="/forums" class="text-lg">Forums</a>
        <ChevronRight class="h-6 w-6 text-foreground" />
      </div>

      <div class="flex justify-between items-center w-full bg-secondary p-2 rounded-lg">
        <MessageSquare class="h-6 w-6 text-primary" />
        <a href="/messages" class="text-lg">Messages</a>
        <span
          v-if="pusherStore.unreadConversationsCount > 0"
          class="absolute right-16 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
        >
          {{ pusherStore.unreadConversationsCount }}
        </span>
        <ChevronRight class="h-6 w-6 text-foreground" />
      </div>
    </div>

    <hr class="my-4 border-gray-600 w-full" />

    <div class="w-full">
      <div class="flex justify-between items-center w-full bg-secondary p-2 rounded-lg">
        <LogOut class="h-6 w-6 text-primary" />
        <a @click="logout" class="text-lg">Déconnexion</a>
        <ChevronRight class="h-6 w-6 text-foreground" />
      </div>
    </div>
  </div>
</template>
