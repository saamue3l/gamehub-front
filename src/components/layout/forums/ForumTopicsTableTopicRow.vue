<script setup lang="ts">
import { highlightSearch, httpBackend } from '@/lib/utils'
import { TableCell, TableRow } from '@/components/ui/table'
import SmallUserCardLink from '@/components/layout/user/SmallUserCardLink.vue'
import TextLink from '@/components/ui/link/TextLink.vue'
import PostCard from '@/components/layout/forums/PostCard.vue'
import type { Post, Topic } from '@/types/Forum'
import { UserStore } from '@/store/userStore'
import { ref } from 'vue'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/toast'
import ForumSaveButton from '@/components/ui/button/SaveButton.vue'
import ForumEditButton from '@/components/ui/button/EditButton.vue'
import ForumDeleteButton from '@/components/ui/button/DeleteButton.vue'
import ConfirmationDialog from '@/components/ui/dialog/ConfirmationDialog.vue'

const { toast } = useToast()

const userStore = UserStore()
const userName = userStore.username
const isAdmin = ref<boolean>(userStore.isAdmin())
const editingTopic = ref<boolean>(false)
const editingLoading = ref<boolean>(false)
const removingLoading = ref<boolean>(false)

const props = withDefaults(
  defineProps<{
    topic: Topic
    search?: string
    showPosts?: boolean
  }>(),
  {
    showPosts: false
  }
)

const emit = defineEmits<{
  (e: 'removeTopic', topicId: number): void
}>()

function getLastPostDate(posts) {
  let lastDate = posts
    .sort(
      (a: Post, b: Post) => new Date(a.creationDate).getTime() - new Date(b.creationDate).getTime()
    )
    .pop()?.creationDate
  return lastDate ? new Date(lastDate).toLocaleDateString() : ''
}

function editTopic() {
  editingTopic.value = !editingTopic.value
}

async function sendTopicModifcation() {
  if (editingLoading.value) return
  try {
    editingLoading.value = true
    await httpBackend(`/api/forums/editTopic/${props.topic.id}`, 'POST', {
      title: props.topic.title
    })
    editingTopic.value = false
  } catch (error) {
    error.toString()
    toast({
      title: 'Erreur',
      description: 'Une erreur est survenue lors de la modification du sujet : ' + error.message,
      variant: 'destructive'
    })
    console.error("Error while editing topic's title", error)
  } finally {
    editingLoading.value = false
  }
}

async function removeTopic() {
  if (removingLoading.value) return
  try {
    removingLoading.value = true
    await httpBackend(`/api/forums/removeTopic/${props.topic.id}`, 'POST')
    toast({
      title: 'Succès',
      description: 'Le sujet a bien été supprimé',
      variant: 'default'
    })
    emit('removeTopic', props.topic.id)
    props.topic = null
  } catch (error) {
    error.toString()
    toast({
      title: 'Erreur',
      description: 'Une erreur est survenue lors de la suppression du sujet : ' + error.message,
      variant: 'destructive'
    })
    console.error('Error while removing topic', error)
  } finally {
    removingLoading.value = false
  }
}
</script>

<template>
  <TableRow :id="topic.id">
    <TableCell class="w-full">
      <router-link
        v-if="!editingTopic"
        :to="{
          name: 'ViewTopic',
          params: { forumId: topic.forumId!, topicId: topic.id }
        }"
      >
        <TextLink v-html="highlightSearch(topic.title, search)" />
      </router-link>
      <div v-else class="flex flex-row justify-start gap-3">
        <!-- Edit title -->
        <Input v-model="topic.title" @keydown.enter="sendTopicModifcation" />
        <ForumSaveButton :is-loading="editingLoading" @click="sendTopicModifcation" />
      </div>
    </TableCell>
    <TableCell>
      <SmallUserCardLink :user="topic.creator" />
    </TableCell>
    <TableCell v-if="search == undefined">{{ topic.posts.length }}</TableCell>
    <TableCell v-if="search == undefined">{{ getLastPostDate(topic.posts) }}</TableCell>
    <TableCell class="flex flex-row justify-center gap-1.5">
      <ForumEditButton v-if="isAdmin || topic.creator.username == userName" @click="editTopic" />
      <ConfirmationDialog
        v-if="isAdmin || topic.creator.username == userName"
        title="Suppression du sujet de discussion"
        :on-confirm="removeTopic"
        :message="`Êtes-vous certains de vouloir supprimer le sujet de discussion &quot;${topic.title}&quot; ?`"
        confirm-button-text="Supprimer"
        confirm-button-variant="destructive"
        :is-loading="removingLoading"
      >
        <ForumDeleteButton :is-loading="removingLoading" />
      </ConfirmationDialog>
    </TableCell>
  </TableRow>
  <TableRow v-if="showPosts && topic.posts.length > 0" class="bg-muted">
    <TableCell class="w-full" colspan="4">
      <PostCard
        v-for="post in topic.posts.slice(0, 3)"
        :post="post"
        :search="search"
        :showReactions="false"
      />
      <p v-if="topic.posts.length > 3" class="text-sm text-gray-500">
        ({{ topic.posts.length - 3 }} autres messages) ...
      </p>
    </TableCell>
  </TableRow>
</template>

<style scoped></style>
