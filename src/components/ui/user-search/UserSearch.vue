<script setup lang="ts">
import { ref, watch } from 'vue';
import { httpBackend } from '@/lib/utils';
import SearchBar from '@/components/ui/inputs/searchbar/SearchBar.vue';
import UserCard from '@/components/layout/users/UserCard.vue';
import { Skeleton } from '@/components/ui/skeleton';

const emit = defineEmits<{
  (e: 'select-user', user: { id: number, username: string, picture: string } | null): void
}>();

const users = ref<{ id: number, username: string, picture: string }[]>([]);
const isLoading = ref(false);
const errorMessage = ref<string | null>(null);
const selectedUser = ref<{ id: number, username: string, picture: string } | null>(null);
const userSearch = ref('');

watch(userSearch, async (newQuery) => {
  if (newQuery === '') {
    users.value = [];
    return;
  }

  try {
    isLoading.value = true;
    users.value = await httpBackend<{ id: number, username: string, picture: string }[]>('/api/user/searchUsers', 'POST', { search: newQuery });
    if (users.value.length === 0) {
      errorMessage.value = 'Aucun utilisateur trouvé';
    } else {
      errorMessage.value = '';
    }
  } catch (error) {
    errorMessage.value = 'Erreur lors de la recherche des utilisateurs';
    console.error('Error fetching users:', error);
  } finally {
    isLoading.value = false;
  }
});

function selectUser(user: { id: number, username: string, picture: string }) {
  emit('select-user', user);
  selectedUser.value = user;
  userSearch.value = user.username;
  users.value = []; // Clear the user list immediately
}
</script>

<template>
  <section id="searchUser">
    <header>
      <SearchBar
        placeholder="Rechercher un utilisateur"
        :autocomplete="false"
        v-model="userSearch"
        @input="searchUser"
      ></SearchBar>
    </header>
    <section
      ref="userPreviewContainer"
      class="flex justify-start overflow-auto gap-3 flex-grow flex-shrink basis-0 py-3"
    >
      <!-- while fetching -->
      <Skeleton
        v-if="isLoading"
        class="w-[150px] min-w-[150px] h-[243px]"
        v-for="i in Math.floor(Math.random() * 3) + 2"
        :key="i"
      ></Skeleton>

      <!-- If error while fetching -->
      <div v-else-if="errorMessage" class="text-red-500 text-center">
        <p>{{ errorMessage }}</p>
      </div>

      <UserCard
        v-else
        v-for="user in users"
        :key="user.id"
        :user="user"
        :is-selected="selectedUser?.id === user.id"
        @click="selectUser(user)"
      ></UserCard>
    </section>
  </section>
</template>

<style scoped></style>