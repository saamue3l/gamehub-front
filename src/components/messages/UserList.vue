<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import List from '@/components/ui/list/List.vue'
import { Skeleton } from '@/components/ui/skeleton'

const props = defineProps({
  users: Array,
  selectedUser: Object,
  isLoading: Boolean // Ajout d'une prop pour indiquer si la liste est en cours de chargement
})

const emit = defineEmits(['selectUser'])

function selectUser(user) {
  emit('selectUser', user)
}
</script>

<template>
  <div class="max-h-96 overflow-y-auto">
    <!-- Affichage du Skeleton pendant le chargement -->
    <div v-if="isLoading">
      <Skeleton
        class="w-full h-10 mb-2 rounded-full"
      v-for="i in 5"
      :key="i"
      />
    </div>

    <!-- Liste des utilisateurs -->
    <List v-else :items="users" :selectedUser="selectedUser" @click="selectUser">
      <template #default="{ item }">
        <div class="flex items-center my-0.5" v-if="item && item.username">
          <img :src="item.picture" alt="User Picture" class="w-8 h-8 rounded-full mr-2" />
          {{ item.username }}
        </div>
      </template>
    </List>
  </div>
</template>

<style scoped></style>
