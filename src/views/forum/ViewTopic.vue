<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { httpBackend } from '@/lib/utils'
import { useRoute } from 'vue-router'
import type { Forum, Topic } from '@/types/Forum'
import ForumChildContainer from '@/components/layout/forums/ForumChildContainer.vue'
import { Skeleton } from '@/components/ui/skeleton'
import PostCard from '@/components/layout/forums/PostCard.vue'
import NewPostForm from '@/components/layout/forums/forms/NewPostForm.vue'

const route = useRoute()

const forum = defineModel<Forum>('forum')
const topic = defineModel<Topic>('topic')

const isLoading = ref(true)
const errorMessage = ref<string | null>(null)
const forumId = route.params.forumId
const topicId = route.params.topicId

const errorMessageWrap = computed<string | null>(() => {
  if (errorMessage.value) {
    return errorMessage.value
  }
  if (topic.value?.posts.length === 0) {
    return 'Aucun post trouvé. Soyez le premier à en écrire un !'
  }
  return null
})

async function fetchForum() {
  try {
    isLoading.value = true
    errorMessage.value = null

    let fetchedTopic = await httpBackend<Topic>(`/api/forums/getTopic/${topicId}`, 'GET')
    // Sorting posts by creation date
    fetchedTopic.posts.sort(
      (a, b) => new Date(a.creationDate).getTime() - new Date(b.creationDate).getTime()
    )
    topic.value = fetchedTopic

    // Fix breadcrumb if the user just got here without ref
    if (forum.value == undefined) {
      forum.value = await httpBackend<Forum>(`/api/forums/getForum/${forumId}`, 'GET')
    }
  } catch (error) {
    errorMessage.value =
      "Nous n'avons pas réussi à télécharger les posts. Veuillez réessayer plus tard."
    console.error('Error fetching the topic informations and posts:', error)
  } finally {
    isLoading.value = false
  }
}

function removePost(postId: number) {
  topic.value?.posts.splice(
    topic.value?.posts.findIndex((p) => p.id == postId),
    1
  )
}

onMounted(fetchForum)
</script>

<template>
  <ForumChildContainer :title="topic?.title" :is-loading="isLoading">
    <section class="flex flex-col gap-1.5 justify-start items-stretch">
      <!-- while fetching -->
      <Skeleton
        v-if="isLoading"
        v-for="i in Math.floor(Math.random() * 3) + 2"
        class="self-start h-[150px] w-[100%]"
      />

      <!-- If error while fetching -->
      <div v-else-if="errorMessageWrap" class="text-red-500 text-center">
        <p>{{ errorMessageWrap }}</p>
      </div>

      <PostCard v-if="topic" v-for="post in topic.posts" :post="post" @remove-post="removePost" />
    </section>
  </ForumChildContainer>

  <NewPostForm
    v-if="topic"
    :topic="topic"
    @created-post="
      (value) => {
        topic?.posts.push(value)
      }
    "
  />
</template>

<style scoped></style>
