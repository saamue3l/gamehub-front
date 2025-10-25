import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useXpAnimationStore = defineStore('xpAnimation', () => {
  const xpPopupRef = ref<{ showXpGain: (amount: number) => void } | null>(null)
  const levelPopupRef = ref<{ showLevelUp: (oldLevel: number, newLevel: number) => void } | null>(
    null
  )

  function setPopupRef(ref: any) {
    xpPopupRef.value = ref
  }

  function setLevelPopupRef(ref: any) {
    levelPopupRef.value = ref
  }

  function showXpGain(amount: number) {
    xpPopupRef.value?.showXpGain(amount)
  }

  function showLevelUp(oldLevel: number, newLevel: number) {
    levelPopupRef.value?.showLevelUp(oldLevel, newLevel)
  }

  return {
    setPopupRef,
    setLevelPopupRef,
    showXpGain,
    showLevelUp
  }
})
