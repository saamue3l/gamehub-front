<script setup lang="ts">
import { ref } from 'vue'
import gsap from 'gsap'

interface XpGain {
  id: number
  amount: number
}

const xpGains = ref<XpGain[]>([])

const showXpGain = (amount: number) => {
  const gain = {
    id: Date.now(),
    amount
  }
  xpGains.value.push(gain)

  setTimeout(() => {
    xpGains.value = xpGains.value.filter((g) => g.id !== gain.id)
  }, 2000)
}

const beforeEnter = (el: Element) => {
  gsap.set(el, {
    opacity: 0,
    scale: 0.5,
    y: 100
  })
}

const enter = (el: Element, done: () => void) => {
  gsap.to(el, {
    duration: 0.5,
    opacity: 1,
    scale: 1,
    y: 0,
    ease: 'back.out(1.7)',
    onComplete: done
  })
}

const afterEnter = (el: Element) => {
  gsap.to(el, {
    duration: 1,
    y: -60,
    opacity: 0,
    ease: 'power1.in'
  })
}

const leave = (el: Element) => {
  gsap.to(el, {
    duration: 0.3,
    opacity: 0,
    scale: 0.5
  })
}

defineExpose({ showXpGain })
</script>

<template>
  <Teleport to="body">
    <TransitionGroup
      tag="div"
      class="fixed bottom-4 left-1/2 transform -translate-x-1/2 pointer-events-none z-50"
      @before-enter="beforeEnter"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
    >
      <div
        v-for="gain in xpGains"
        :key="gain.id"
        class="flex items-center justify-center px-4 py-2 bg-primary/20 backdrop-blur-sm rounded-full"
      >
        <span class="text-2xl font-bold text-primary/90">+{{ gain.amount }} XP</span>
      </div>
    </TransitionGroup>
  </Teleport>
</template>
