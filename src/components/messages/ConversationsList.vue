<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import List from '@/components/ui/list/ListItem.vue'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'

const props = defineProps({
  conversations: Array, // Liste des conversations à afficher
  selectedConversation: Object, // Conversation actuellement sélectionnée
  isLoading: Boolean // Indicateur de chargement
})

const emit = defineEmits(['selectConversation']) // Nouvel événement

function selectConversation(selectedConversation) {
  console.log('Conversation selected : ', selectedConversation)
  emit('selectConversation', selectedConversation)
}
</script>

<template>
  <div class="p-2">
    <div v-if="isLoading">
      <Skeleton class="w-full h-10 mb-2 rounded-full" v-for="i in 5" :key="i" />
    </div>

    <!-- Liste des conversations -->
    <List
      v-else
      :items="conversations"
      :selectedItem="selectedConversation"
      @click="selectConversation"
    >
      <template #default="{ item }">
        <div class="flex items-center gap-x-2">
          <Avatar class="size-8 bg-primary">
            <AvatarImage v-if="item.picture" :src="item.picture" :alt="item.username" />
            <AvatarFallback v-else>
              {{ item.username?.charAt(0).toUpperCase() ?? 'U' }}
            </AvatarFallback>
          </Avatar>

          <div>{{ item.username }}</div>
        </div>
      </template>
    </List>
  </div>
</template>
