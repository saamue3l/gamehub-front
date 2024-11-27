<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import List from '@/components/ui/list/ListItem.vue'
import { Skeleton } from '@/components/ui/skeleton'

const props = defineProps({
  conversations: Array, // Liste des conversations à afficher
  selectedConversation: Object, // Conversation actuellement sélectionnée
  isLoading: Boolean // Indicateur de chargement
})

const emit = defineEmits(['selectConversation']) // Nouvel événement

function selectConversation(selectedConversation) {
  console.log("Conversation selected : ", selectedConversation)
  emit('selectConversation', selectedConversation)
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

    <!-- Liste des conversations -->
    <List v-else :items="conversations" :selectedItem="selectedConversation" @click="selectConversation">
      <template #default="{ item }">
        <div class="flex items-center my-0.5">
          <img :src="item.picture" alt="Conversation Picture" class="w-8 h-8 rounded-full mr-2" />
          <div>{{ item.username }}</div>
        </div>
      </template>
    </List>
  </div>
</template>
