<script setup lang="ts">
import { ref, watch, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { UserStore } from '@/store/userStore'
import type { UserInfo } from '@/types/UserInfo'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { httpBackend } from '@/lib/utils'
import { useProfileStore } from '@/store/profileStore'
import { Button } from '@/components/ui/button'
import { Mail } from 'lucide-vue-next'
import defaultPfp from '@/assets/defaultPfp1.png'

const profileStore = useProfileStore()
const isLoading = ref(true)
const errorMessage = ref<string | null>(null)
const route = useRoute()
const userInfo = ref<UserInfo | null>(null)
const userStore = UserStore()

const fetchUserInfo = async () => {
  try {
    isLoading.value = true
    userInfo.value = await httpBackend<UserInfo>(`/api/profile/${route.params.username}/userInfo`)
  } catch (err) {
    errorMessage.value =
      "Erreur lors de la récupération des informations de l'utilisateur. Veuillez réessayer plus tard."
  } finally {
    isLoading.value = false
  }
}

const xpAnimation = ref()

import { useRouter } from 'vue-router'
const router = useRouter()

const sendMessage = (userId) => {
  router.push({
    name: 'messages',
    query: {
      newMessage: true,
      userId: userId
    }
  })
}
watch(
  () => userStore.xp,
  (newXp, oldXp) => {
    if (newXp > oldXp) {
      xpAnimation.value?.showXpGain(newXp - oldXp)
    }
  }
)

watchEffect(() => {
  if (route.params.username) {
    fetchUserInfo()
  }
})
</script>

<template>
  <div v-if="isLoading" class="flex max-md:flex-col max-md:items-center mb-4">
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

  <div
    v-else
    class="mb-4 flex max-md:flex-col md:justify-between items-end max-md:items-center max-md:gap-y-2"
  >
    <div class="flex max-md:flex-col max-md:items-center">
      <Avatar class="size-16">
        <AvatarImage v-if="userInfo.picture" :src="userInfo.picture" :alt="userInfo.username" />
        <AvatarImage v-else :src="defaultPfp" alt="photo de profil" />
      </Avatar>
      <div class="flex flex-col justify-center max-md:flex-col max-md:items-center space-y-1 ml-2">
        <div class="flex items-center space-x-2">
          <span class="font-medium">{{ userInfo.username }}</span>
          <div
            class="flex items-center justify-center h-6 w-6 font-bold bg-primary text-white rounded-full text-xs"
          >
            {{ profileStore.isOwnProfile ? userStore.level : userInfo.level }}
          </div>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger as-child>
              <Progress
                :model-value="profileStore.isOwnProfile ? userStore.xpInCurrentLevel : userInfo.xp"
                :max="100"
                class="w-40 h-2"
              />
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>
                {{
                  profileStore.isOwnProfile
                    ? `${userStore.xpInCurrentLevel}/100 (Total : ${userStore.xp - 100}xp)`
                    : `${userInfo.xp}/100 (Total : ${userInfo.totalXp - 100}xp)`
                }}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
    <Button
      v-if="!profileStore.isOwnProfile"
      @click="sendMessage(userInfo.id)"
      variant="secondary"
      class="gap-x-2"
      size="xs"
    >
      <Mail class="h-4 w-4" />
      <p class="font-normal">Message privé</p>
    </Button>
  </div>
</template>
