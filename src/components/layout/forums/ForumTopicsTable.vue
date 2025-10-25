<script setup lang="ts">
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import type { Topic } from '@/types/Forum'
import ForumTopicsTableTopicRow from '@/components/layout/forums/ForumTopicsTableTopicRow.vue'
import { computed } from 'vue'

// DefinePorps with defaults
const props = withDefaults(
  defineProps<{
    topics: Topic[] | null
    isLoading: boolean
    errorMessage: string | null
    search?: string
    showPosts?: boolean
  }>(),
  {
    showPosts: false
  }
)

const errorMessageWrap = computed<string | null>(() => {
  if (props.errorMessage) {
    return props.errorMessage
  }
  if (props.topics?.length === 0) {
    return 'Aucun sujet trouvé'
  }
  return null
})

const emit = defineEmits<{
  (e: 'removeTopic', topicId: number): void
}>()
</script>

<template>
  <!-- while fetching -->
  <Skeleton v-if="isLoading" class="self-start h-[500px] w-[100%]" />

  <!-- If error while fetching -->
  <div v-else-if="errorMessageWrap" class="text-red-500 text-center">
    <p>{{ errorMessageWrap }}</p>
  </div>

  <!-- When fetched -->
  <Table v-else-if="props.topics?.length > 0">
    <TableHeader>
      <TableRow>
        <TableHead class="flex-1">
          {{ props.showPosts ? 'Sujet/Post'.toUpperCase() : 'Sujet'.toUpperCase() }}
        </TableHead>
        <TableHead> {{ 'Auteur'.toUpperCase() }} </TableHead>
        <TableHead v-if="props.search == undefined"> {{ 'NB Messages'.toUpperCase() }} </TableHead>
        <TableHead v-if="props.search == undefined">
          {{ 'Dernier message'.toUpperCase() }}
        </TableHead>
        <TableHead> {{ 'Actions'.toUpperCase() }} </TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TransitionGroup name="list">
        <ForumTopicsTableTopicRow
          v-for="topic in props.topics"
          v-key="topic.id"
          :topic="topic"
          :search="props.search"
          :show-posts="props.showPosts"
          @remove-topic="(topicId) => emit('removeTopic', topicId)"
        />
      </TransitionGroup>
    </TableBody>
  </Table>
</template>

<style scoped></style>
