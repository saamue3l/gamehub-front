<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  selectedUser: {
    type: Object,
    required: false,
  },
});

const emit = defineEmits(['click']);
</script>

<template>
  <ul>
    <li
      v-for="item in items"
      :key="item.id"
      :class="[
        'text-custom-white text-sm font-medium rounded-3xl hover:bg-secondary px-2 py-2 transition',
        { 'bg-secondary': selectedUser && selectedUser.id === item.id }
      ]"
      @click="() => emit('click', item)"
    >
      <slot :item="item">{{ item.name }}</slot>
    </li>
  </ul>
</template>

<style scoped>
ul {
  list-style-type: none;
  padding: 0;
}
li {
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  cursor: pointer;
}
</style>