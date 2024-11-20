<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import List from '@/components/ui/list/List.vue'

const props = defineProps({
  users: Array,
  selectedUser: Object
})

const emit = defineEmits(['selectUser'])

function selectUser(user) {
  emit('selectUser', user)
}
</script>

<template>
  <div class="max-h-96 overflow-y-auto">
    <List :items="users" :selectedUser="selectedUser" @click="selectUser">
      <template #default="{ item }">
        <div class="my-0.5" v-if="item && item.username">{{ item.username }}</div>
      </template>
    </List>
  </div>
</template>

<style scoped></style>
