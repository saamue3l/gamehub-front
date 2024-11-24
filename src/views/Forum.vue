<script setup lang="ts">
import BasePage from '@/components/layout/BasePage.vue'
import SearchBar from '@/components/ui/inputs/searchbar/SearchBar.vue'
import { ref } from 'vue'
import type { Forum, Topic } from '@/types/Forum'
import ForumBreadCrumb from '@/components/layout/forums/ForumBreadCrumb.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const search = ref<string>('')
const forum = ref<Forum | undefined>()
const topic = ref<Topic | undefined>()

function onSearchInput() {
  if (search.value.trim() != '') {
    router.push({
      name: 'SearchInForums',
      params: { search: search.value },
      query: { ref: router.currentRoute.value.fullPath, ...router.currentRoute.value.query }
    })
  }
}
</script>

<template>
  <BasePage title="Forums">
    <header class="w-full flex flex-col gap-3">
      <div class="w-full flex justify-between flex-wrap gap-3">
        <article class="flex gap-3 float-left flex-wrap">
          <SearchBar
            placeholder="Rechercher dans les forums"
            v-model="search"
            @input="onSearchInput"
          />
        </article>
      </div>
      <div>
        <ForumBreadCrumb :forum="forum" :topic="topic" />
      </div>
    </header>

    <section class="w-full border p-6 flex flex-col gap-16">
      <router-view v-slot="{ Component }">
        <component :is="Component" v-model:forum="forum" v-model:topic="topic" />
      </router-view>
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
