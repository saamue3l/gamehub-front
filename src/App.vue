<script setup lang="ts">
import MainLayout from '@/components/layout/MainLayout.vue'
import Toaster from '@/components/ui/toast/Toaster.vue'
import { onMounted, onBeforeUnmount, ref, watch, provide } from 'vue'
import XpGainAnimation from '@/components/XpGainAnimation.vue'
import { useXpAnimationStore } from '@/store/xpAnimationStore'
import LevelUpAnimation from '@/components/LevelUpAnimation.vue'
import { UserStore } from '@/store/userStore'
import { PusherStore} from '@/store/pusherStore'
import { httpBackend } from '@/lib/utils'


const xpPopup = ref(null)
const levelPopup = ref(null)
const xpAnimationStore = useXpAnimationStore()
const userStore = UserStore()

const pusherStore = PusherStore(); // Utiliser le store
const userId = ref(null);

onMounted(async () => {
  xpAnimationStore.setPopupRef(xpPopup.value)
  xpAnimationStore.setLevelPopupRef(levelPopup.value)

  await fetchUserId()
})

onBeforeUnmount(() => {
  if (userId.value) {
    pusherStore.unsubscribeFromUserChannel(userId.value);
  }
})

watch(() => userStore.username, async (newUsername, oldUsername) => {
  if (oldUsername) {
    pusherStore.unsubscribeFromUserChannel(userId.value)
  }
  if (newUsername) {
    await fetchUserId()
  }
})

const fetchUserId = async () => {
  try {
    userId.value = await httpBackend('/api/currentUser', 'GET');
    if (userId.value) {
      pusherStore.subscribeToUserChannel(userId.value)
      pusherStore.registerEventHandler('App\\Events\\MessageSent', handleNewMessageEvent)
    }
  } catch (error) {
    console.error('Error fetching user ID:', error);
  }
};

const handleNewMessageEvent = (data) => {
  console.log('New message event:', data)
  // Add your notification logic here
}

</script>

<template>
  <Toaster />
  <MainLayout>
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </MainLayout>
  <XpGainAnimation ref="xpPopup" />
  <LevelUpAnimation ref="levelPopup" />
</template>