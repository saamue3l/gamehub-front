<script setup lang="ts">
import { httpBackend } from '@/lib/utils'
import { onMounted, ref, shallowRef } from 'vue'
import type { Forum, Topic } from '@/types/Forum'
import { useRoute } from 'vue-router'
import ForumChildContainer from '@/components/layout/forums/ForumChildContainer.vue'
import NewTopicForm from '@/components/layout/forums/forms/NewTopicForm.vue'
import ForumTopicsTable from '@/components/layout/forums/ForumTopicsTable.vue'

const route = useRoute()

const forum = defineModel<Forum | undefined>('forum')
const topic = defineModel<Topic | undefined>('topic')
topic.value = undefined

const fetchedForum = shallowRef<Forum | null>(null)

const isLoading = ref(true)
const errorMessage = ref<string | null>(null)
const forumId = route.params.forumId

async function fetchForum() {
  try {
    isLoading.value = true
    errorMessage.value = null

    const response = await httpBackend<Forum>(`/api/forums/getForum/${forumId}`, 'GET')

    console.log('response', response)
    fetchedForum.value = response

    // Add firstPostIndex field to each topic
    fetchedForum.value.topics.forEach((topic: Topic) => {
      topic.firstPostIndex = topic.posts.findIndex(
        (post) =>
          new Date(post.creationDate).getTime() ===
          Math.min(...topic.posts.map((p) => new Date(p.creationDate).getTime()))
      )
      topic.forumId = fetchedForum.value!.id
    })
    // Sort topics by last post date
    if (fetchedForum.value.topics.length > 0) {
      fetchedForum.value.topics.sort((a: Topic, b: Topic) => {
        if (b.firstPostIndex === -1 || a.firstPostIndex === -1) {
          // When no post in topic, put it at the end
          return +1
        }
        return (
          new Date(b.posts[b.firstPostIndex!].creationDate).getTime() -
          new Date(a.posts[a.firstPostIndex!].creationDate).getTime()
        )
      })
    }

    forum.value = { id: fetchedForum.value.id, name: fetchedForum.value.name } as Forum
  } catch (error) {
    errorMessage.value =
      error.message ??
      "Nous n'avons pas réussi à télécharger les évènements. Veuillez réessayer plus tard."
    console.error('Error fetching the events:', error.message)
  } finally {
    isLoading.value = false
  }
}

function scrollToTopic(topicId: number) {
  const topicElement = document.getElementById(topicId.toString())
  console.log('topic Element', topicElement)
  if (topicElement) {
    topicElement.scrollIntoView({ behavior: 'smooth' })
  }
}

function removeTopic(topicId: number) {
  // fetchedForum.value!.topics.length = fetchedForum.value!.topics.length - 1
  fetchedForum.value!.topics.splice(
    fetchedForum.value!.topics.findIndex((topic) => topic.id === topicId),
    1
  )
  // fetchedForum.value!.topics = fetchedForum.value!.topics.filter((topic) => topic.id !== topicId)
  // fetchedForum.value.id = fetchedForum.value.id // I'll fuck vue js reactivity in the ass with the twin towers when I'm finished
  fetchForum()
}

onMounted(fetchForum)
</script>

<template>
  <ForumChildContainer :title="forum?.name" :is-loading="isLoading">
    <ForumTopicsTable
      :topics="fetchedForum?.topics ?? []"
      :is-loading="isLoading"
      :error-message="errorMessage"
      @remove-topic="removeTopic"
    />
  </ForumChildContainer>

  <NewTopicForm
    :forum-id="+forumId"
    @created-topic="
      (value) => {
        // Refetch the forum to get the new topic
        fetchForum()
        /*// add to the start of topics
        fetchedForum?.topics.unshift(value)*/
        // Scroll to the new topic
        scrollToTopic(value.id)
      }
    "
  />
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
