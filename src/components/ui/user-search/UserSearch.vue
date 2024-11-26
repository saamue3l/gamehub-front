<script setup lang="ts">
import { ref, watch } from 'vue'
import { httpBackend } from '@/lib/utils'
import SearchBar from '@/components/ui/inputs/searchbar/SearchBar.vue'
import UserCard from '@/components/layout/users/UserCard.vue'
import { Skeleton } from '@/components/ui/skeleton'

// Définir l'événement émis par le composant
const emit = defineEmits<{
  (e: 'select-user', user: { id: number; username: string; picture: string } | null): void
}>()

// Variables réactives
const users = ref([])
const isLoading = ref(false)
const errorMessage = ref<string | null>(null)
const selectedUser = ref(null)
const userSearch = ref('')

// Fonction pour chercher des utilisateurs
const searchUsers = async (query: string) => {
  if (!query.trim()) {
    users.value = []
    errorMessage.value = null
    return
  }

  isLoading.value = true
  try {
    // Appel à l'API avec la requête `query` pour correspondance au début du pseudo
    const result = await httpBackend('/api/user/searchUser', 'GET', { search: query })

    // Vérification supplémentaire côté frontend, si nécessaire
    users.value = (result || []).filter((user: { username: string }) =>
      user.username.toLowerCase().startsWith(query.toLowerCase())
    )

    errorMessage.value = users.value.length ? null : 'Aucun utilisateur trouvé'
  } catch (error) {
    console.error('Error fetching users:', error)
    errorMessage.value = 'Erreur lors de la recherche des utilisateurs'
  } finally {
    isLoading.value = false
  }
}

// Suivi des modifications du champ de recherche
watch(userSearch, (newQuery) => {
  searchUsers(newQuery)
})

// Fonction pour sélectionner un utilisateur
const selectUser = (user: { id: number; username: string; picture: string }) => {
  selectedUser.value = user
  userSearch.value = user.username
  users.value = [] // Nettoyer la liste après sélection
  emit('select-user', user)
}
</script>

<template>
  <section id="searchUser">
    <!-- Barre de recherche -->
    <header>
      <SearchBar
        placeholder="Rechercher un utilisateur"
        :autocomplete="false"
        v-model="userSearch"
      />
    </header>

    <!-- Liste des utilisateurs -->
    <section class="flex justify-start overflow-auto gap-3 py-3">
      <!-- Skeleton en cours de chargement -->
      <Skeleton
        v-if="isLoading"
        class="w-[150px] min-w-[150px] h-[243px]"
        v-for="i in 3"
        :key="i"
      />

      <!-- Message d'erreur -->
      <div v-else-if="errorMessage" class="text-red-500 text-center">
        <p>{{ errorMessage }}</p>
      </div>

      <!-- Cartes utilisateur -->
      <UserCard
        v-else
        v-for="user in users"
        :key="user.id"
        :user="user"
        :is-selected="selectedUser?.id === user.id"
        @click="selectUser(user)"
      />
    </section>
  </section>
</template>

<style scoped>
/* Ajouter du style ici si nécessaire */
</style>
