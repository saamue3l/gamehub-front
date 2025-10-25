<script setup lang="ts">
import MainLayout from '@/components/layout/MainLayout.vue'
import Toaster from '@/components/ui/toast/Toaster.vue'
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
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

  await fetchNewUser()

})

onBeforeUnmount(() => {
  if (userId.value) {
    console.log("[APP.VUE] DÉSenregistrement d'un événément pour les nouveaux messages")
    pusherStore.unsubscribeFromUserChannel(userId.value);
  }
})

watch(() => userStore.username, async (newUsername, oldUsername) => {
  if (oldUsername) {
    console.log("[APP.VUE] DÉSenregistrement d'un événément pour les nouveaux messages")
    pusherStore.unsubscribeFromUserChannel(userId.value)
  }
  if (newUsername) {
    await fetchNewUser()
  }
})

const fetchNewUser = async () => {
  if (userStore.username) {
    console.log("Trying to fetch user ID (fetchNewUser) :", userStore.username);
    try {
      userId.value = await httpBackend('/api/currentUser', 'GET');
      if (userId.value) {
        console.log('User ID:', userId.value)
        pusherStore.subscribeToUserChannel(userId.value)
        console.log("[APP.VUE] Enregistrement d'un événément pour les nouveaux messagers")
        pusherStore.registerEventHandler('App\\Events\\MessageSent', handleNewMessageEvent)
        await pusherStore.fetchUnreadConversationsCount()
      }
    } catch (error) {
      console.error('Error fetching user ID:', error);
    }
  }

};

const handleNewMessageEvent = async (data) => {
  console.log('Nouveau message reçu sur toutes pages:', data)

  // Appel API pour mettre à jour le nombre de conversations non lues
  await pusherStore.fetchUnreadConversationsCount();

  console.log('Conversations non lues:', pusherStore.unreadConversationsCount)
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