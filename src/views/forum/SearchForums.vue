<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed, onMounted, ref, watch } from 'vue'
import { httpBackend } from '@/lib/utils'
import type { Post, Topic } from '@/types/Forum'
import { array } from 'zod'
import ForumTopicsTable from '@/components/layout/forums/ForumTopicsTable.vue'
import { Button } from '@/components/ui/button'
import ForumChildContainer from '@/components/layout/forums/ForumChildContainer.vue'

const route = useRoute()
const search = ref<string>(route.params.search as string)

const isLoading = ref(false)
const error = ref<string | null>(null)

const searchResults = ref<{ topics: Topic[]; posts: Post[] } | null>(null)

const searchResultsTopics = computed<Topic[]>(() => {
  searchResults
  // Aggregate the posts to existing topics and add topics from posts that are not in the list
  // 1. create a map of topics
  // 2. for each post, add the post to the topic in the map or create a new topic
  // 3. return the values of the map
  const topicsMap = new Map<number, Topic>()
  searchResults.value?.topics.forEach((topic) => {
    topic = { ...topic, posts: [] }
    topicsMap.set(topic.id, topic)
  })
  searchResults.value?.posts.forEach((post) => {
    if (topicsMap.has(post.topic!.id)) {
      topicsMap.get(post.topic!.id)!.posts.push(post)
    } else {
      let postTopic = post.topic!
      postTopic.posts = [post]
      topicsMap.set(postTopic.id, postTopic)
    }
  })
  return Array.from(topicsMap.values())
})

watch(
  () => route.params.search,
  (newSearch) => {
    search.value = newSearch as string
    searchForums()
  }
)

let fetchTimeout: ReturnType<typeof setTimeout> | null = null
async function searchForums(withDelay = true) {
  isLoading.value = true
  error.value = null
  try {
    if (!search.value || search.value == '') {
      return
    }

    if (fetchTimeout) {
      clearTimeout(fetchTimeout)
    }
    let response = null
    await new Promise((resolve) => {
      fetchTimeout = setTimeout(
        async () => {
          response = await httpBackend<{ topics: Topic[]; posts: Post[] }>(
            `/api/forums/search`,
            'POST',
            {
              search: search.value
            }
          )
          resolve(response)
        },
        withDelay ? 400 : 0
      ) // Timeout to not spam the API
    })
    searchResults.value = response
  } catch (error) {
    error.toString()
    error.value = error.message
    console.error('Error searching in forums : ', error)
  } finally {
    isLoading.value = false
  }
}

function removeTopic(topicId: number) {
  searchResults.value!.topics = searchResults.value!.topics.filter((topic) => topic.id != topicId)
  searchForums(false)
}

onMounted(() => {
  searchForums(false)
})
</script>

<template>
  <Button variant="secondary" class="w-min">
    <router-link :to="route.query.ref as string" as-child>← Retour</router-link>
  </Button>
  <ForumChildContainer :title="`Recherche &quot;${search}&quot;`" :is-loading="isLoading">
    <ForumTopicsTable
      :topics="searchResultsTopics"
      :is-loading="isLoading"
      :error-message="error"
      :search="search"
      :showPosts="true"
      @remove-topic="removeTopic"
    />
  </ForumChildContainer>
</template>

<style scoped></style>
