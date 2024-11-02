<template>
  <TitleContainer title="ALIAS">
    <div class="flex flex-wrap pt-2 pl-2">
      <div v-if="isLoading">
        <Skeleton class="w-24 h-8 rounded-full mr-2 mb-2" />
      </div>

      <div v-else-if="error" class="text-red-500 text-center">
        <p>{{ error }}</p>
      </div>

      <div
        v-else-if="!userAlias.length"
        class="flex justify-center items-center text-center pr-2 pb-2 text-custom-white"
      >
        <p>Aucun pseudo ajouté</p>
      </div>

      <template v-else>
        <template v-for="alias in userAlias" :key="alias.id">
          <AliasItem
            :icon-url="alias.platform.logoUrl"
            :username="alias.username"
            :copyable="true"
          />
        </template>
      </template>

      <EditAliasDialog v-if="profileStore.isOwnProfile && !isLoading" :initial-alias="userAlias" />
    </div>
  </TitleContainer>
</template>

<script setup lang="ts">
import { watchEffect } from 'vue'
import TitleContainer from '@/components/profile/TitleContainer.vue'
import AliasItem from '@/components/profile/Alias/AliasItem.vue'
import { Skeleton } from '@/components/ui/skeleton'
import { useRoute } from 'vue-router'
import { useProfileStore } from '@/store/profileStore'
import { storeToRefs } from 'pinia'
import { useUserAliasStore } from '@/store/userAliasStore'
import EditAliasDialog from '@/components/profile/Alias/EditAliasDialog.vue'

const route = useRoute()
const profileStore = useProfileStore()
const userAliasStore = useUserAliasStore()
const { userAlias, isLoading, error } = storeToRefs(userAliasStore)

watchEffect(() => {
  if (route.params.username) {
    userAliasStore.fetchUserAlias(route.params.username as string)
  }
})
</script>
