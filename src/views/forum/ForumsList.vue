<script setup lang="ts">
import ForumCard from '@/components/layout/forums/ForumCard.vue'
import { Skeleton } from '@/components/ui/skeleton'
import { onMounted, ref, onUnmounted } from 'vue'
import type { Forum, Topic } from '@/types/Forum'
import { httpBackend } from '@/lib/utils'
import ForumChildContainer from '@/components/layout/forums/ForumChildContainer.vue'
import NewForumForm from '@/components/layout/forums/forms/NewForumForm.vue'
import { UserStore } from '@/store/userStore'

const forum = defineModel<Forum | undefined>('forum')
const topic = defineModel<Topic | undefined>('topic')
forum.value = undefined
topic.value = undefined

const forums = ref<Forum[]>([])
const isLoading = ref(true)
const errorMessage = ref<string | null>(null)
const userStore = UserStore()
const isAdmin = userStore.isAdmin()

async function fetchForums() {
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

function removeForum(forumId: number) {
  forums.value.splice(
    forums.value.findIndex((f) => f.id == forumId),
    1
  )
}

onMounted(fetchForums)
</script>

<template>
  <!-- Liste des évènements -->
  <div
    class="grid gap-3 justify-around items-start lg:grid-cols-[repeat(auto-fill,minmax(300px,1fr))] grid-cols-[repeat(auto-fill,minmax(100%,1fr))]"
  >
    <!-- while fetching -->
    <Skeleton
      v-if="isLoading"
      class="self-start h-[72px]"
      v-for="i in (Math.floor(Math.random() * 3) + 1) * 2"
    ></Skeleton>

    <!-- If error while fetching -->
    <div v-else-if="errorMessage" class="text-red-500 text-center">
      <p>{{ errorMessage }}</p>
    </div>

    <!-- When fetched -->
    <TransitionGroup name="list">
      <router-link
        v-for="forum in forums"
        :key="forum.id"
        :to="{ name: 'ViewForum', params: { forumId: forum.id } }"
      >
        <ForumCard :forum="forum" :is-admin="isAdmin" @remove-forum="removeForum" />
      </router-link>
    </TransitionGroup>
  </div>

  <NewForumForm @created-forum="(forum) => forums.push(forum)" v-if="isAdmin" />
</template>

<style scoped></style>
