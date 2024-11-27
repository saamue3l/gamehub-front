<template>
  <div v-if="isLoading" class="flex max-md:flex-col max-md:items-center mb-8">
    <Skeleton class="h-16 w-16 rounded-full" />
    <div class="flex flex-col justify-center max-md:flex-col max-md:items-center space-y-1 ml-2">
      <div class="flex items-center space-x-2">
        <Skeleton class="h-4 w-20 rounded-full" />
        <Skeleton class="h-6 w-6 rounded-full" />
      </div>
      <Skeleton class="w-40 h-2" />
    </div>
  </div>

  <div v-else-if="errorMessage" class="text-red-500 text-center">
    <p>{{ errorMessage }}</p>
  </div>

  <div v-else class="flex max-md:flex-col max-md:items-center mb-8">
    <UserAvatar :user="userInfo" size="16" />
    <div class="flex flex-col justify-center max-md:flex-col max-md:items-center space-y-1 ml-2">
      <div class="flex items-center space-x-2">
        <span class="font-medium">{{ userInfo.username }}</span>
        <div
          class="flex items-center justify-center h-6 w-6 font-bold bg-primary text-white rounded-full text-xs"
        >
          {{ userInfo.level }}
        </div>
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger as-child>
            <Progress :model-value="Number(userInfo.xp)" :max="100" class="w-40 h-2" />
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>{{ userInfo.xp }}/100</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import type { UserInfo } from '@/types/UserInfo'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { httpBackend } from '@/lib/utils'
import UserAvatar from '@/components/layout/user/UserAvatar.vue'
import type { User } from '@/types/User'

const isLoading = ref(true)
const errorMessage = ref<string | null>(null)
const route = useRoute()
const userInfo = ref<UserInfo | null>(null)

const fetchUserInfo = async () => {
  try {
    isLoading.value = true
    userInfo.value = await httpBackend<UserInfo>(`/api/profile/${route.params.username}/userInfo`)
  } catch (err) {
    errorMessage.value =
      "Erreur lors de la récupération des infos de l'utilisateur. Veuillez réessayer plus tard."
    console.error('Error fetching user info:', err)
  } finally {
    isLoading.value = false
  }
}

watchEffect(() => {
  if (route.params.username) {
    fetchUserInfo()
  }
})
</script>
