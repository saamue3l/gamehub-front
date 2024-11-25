<script setup lang="ts">
import FavoriteGames from '@/components/profile/FavoriteGames/FavoriteGames.vue'
import Alias from '@/components/profile/Alias/Alias.vue'
import Availability from '@/components/profile/Availability/Availability.vue'
import Achievements from '@/components/profile/Achievements/Achievements.vue'
import BasePage from '@/components/layout/BasePage.vue'
import UserInfo from '@/components/profile/UserInfo.vue'
import UserStats from '@/components/profile/UserStats/UserStats.vue'

const components = [
  { component: Alias, order: { mobile: 1, desktop: 2 } },
  { component: FavoriteGames, order: { mobile: 2, desktop: 1 } },
  { component: Availability, order: { mobile: 3, desktop: 3 } },
  { component: Achievements, order: { mobile: 4, desktop: 4 } }
]
</script>

<template>
  <BasePage title="" class="max-md:w-full max-md:p-2 max-md:flex max-md:justify-center">
    <div class="flex flex-col">
      <UserInfo />

      <UserStats />

      <div class="hidden md:flex justify-between">
        <div class="pr-8 flex-1 min-w-72">
          <component :is="components.find((c) => c.order.desktop === 1).component" />
        </div>
        <div class="flex flex-col space-y-8 w-1/3">
          <component
            v-for="i in [2, 3, 4]"
            :key="i"
            :is="components.find((c) => c.order.desktop === i).component"
          />
        </div>
      </div>

      <div class="flex flex-col space-y-8 md:hidden">
        <component
          v-for="i in [1, 2, 3, 4]"
          :key="i"
          :is="components.find((c) => c.order.mobile === i).component"
        />
      </div>
    </div>
  </BasePage>
</template>
