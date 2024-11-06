<script setup lang="ts">
import BasePage from '@/components/layout/BasePage.vue'
import { httpBackend } from '@/lib/utils'
import { onMounted, ref } from 'vue'
import { Skeleton } from '@/components/ui/skeleton'
import SearchBar from '@/components/ui/inputs/searchbar/SearchBar.vue'
import type { Forum } from '@/types/Forum'
import ForumCard from '@/components/layout/forums/ForumCard.vue'

const forums = ref<Forum[]>([])
const isLoading = ref(true)
const errorMessage = ref<string | null>(null)
const search = ref<string>('')
const joinedFilter = ref<boolean>(false)

async function fetchEvents() {
  try {
    isLoading.value = true
    errorMessage.value = null

    forums.value = await httpBackend('/api/forums/allForums', 'GET')
    if (forums.value.length == 0) {
      errorMessage.value = "Aucun forum n'as été trouvé"
    }
  } catch (error) {
    errorMessage.value =
      "Nous n'avons pas réussi à télécharger les forums. Veuillez réessayer plus tard."
    console.error('Error fetching the events:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchEvents)
</script>

<template>
  <BasePage title="Forums">
    <header class="w-full flex justify-between flex-wrap gap-3 max-w-full">
      <article class="flex gap-3 float-left flex-wrap">
        <SearchBar placeholder="Rechercher dans les forums" />
      </article>
      <article class="flex gap-3 float-right">
        <!--    TODO : Create Forum button    -->
      </article>
    </header>

    <!-- Liste des évènements -->
    <section
      class="w-full border p-6 grid gap-3 justify-around items-start lg:grid-cols-[repeat(auto-fill,minmax(300px,1fr))] grid-cols-[repeat(auto-fill,1fr)]"
    >
      <!-- while fetching -->
      <Skeleton
        v-if="isLoading"
        class="self-start h-[72px] w-[33%]]"
        v-for="i in (Math.floor(Math.random() * 3) + 1) * 2"
      ></Skeleton>

      <!-- If error while fetching -->
      <div v-else-if="errorMessage" class="text-red-500 text-center">
        <p>{{ errorMessage }}</p>
      </div>

      <!-- When fetched -->
      <TransitionGroup name="list">
        <ForumCard v-for="forum in forums" :forum="forum" :key="forum.id"></ForumCard>
      </TransitionGroup>
    </section>
  </BasePage>
</template>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
}
</style>
