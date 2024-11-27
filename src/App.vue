<script setup lang="ts">
import MainLayout from '@/components/layout/MainLayout.vue'
import Toaster from '@/components/ui/toast/Toaster.vue'
import { onMounted, ref } from 'vue'
import XpGainAnimation from '@/components/XpGainAnimation.vue'
import { useXpAnimationStore } from '@/store/xpAnimationStore'
import LevelUpAnimation from '@/components/LevelUpAnimation.vue'

const xpPopup = ref(null)
const levelPopup = ref(null)
const xpAnimationStore = useXpAnimationStore()

onMounted(() => {
  xpAnimationStore.setPopupRef(xpPopup.value)
  xpAnimationStore.setLevelPopupRef(levelPopup.value)
})
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
