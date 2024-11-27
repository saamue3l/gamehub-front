<!-- Petite carte présentant les informations principale d'un évènement de jeu-->

<script setup lang="ts">
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import type { Forum } from '@/types/Forum'
import ForumEditButton from '@/components/layout/forums/forms/buttons/ForumEditButton.vue'
import ForumDeleteButton from '@/components/layout/forums/forms/buttons/ForumDeleteButton.vue'
import { httpBackend } from '@/lib/utils'
import { toast } from '@/components/ui/toast'
import { ref } from 'vue'
import { Input } from '@/components/ui/input'
import ForumSaveButton from '@/components/layout/forums/forms/buttons/ForumSaveButton.vue'

const props = withDefaults(
  defineProps<{
    forum: Forum
    isAdmin?: boolean
  }>(),
  {
    isAdmin: false
  }
)

const emit = defineEmits<{
  (e: 'removeForum', forumId: number): void
}>()

const editingForum = ref<boolean>(false)
const editingLoading = ref<boolean>(false)
const removingLoading = ref<boolean>(false)

function editForum() {
  editingForum.value = !editingForum.value
}

async function sendForumModifcation() {
  if (editingLoading.value) return
  try {
    editingLoading.value = true
    await httpBackend(`/api/forums/editForum/${props.forum.id}`, 'POST', {
      name: props.forum.name
    })
    toast({
      title: 'Succès',
      description:
        "Le forum a bien été modifié. Les modifications peuvent prendre un peu de temps avant d'être prises en compte.",
      variant: 'default'
    })
    editingForum.value = false
  } catch (error) {
    error.toString()
    toast({
      title: 'Erreur',
      description: 'Une erreur est survenue lors de la modification du forum : ' + error.message,
      variant: 'destructive'
    })
    console.error("Error while editing forum's name", error)
  } finally {
    editingLoading.value = false
  }
}

async function removeForum() {
  if (removingLoading.value) return
  try {
    removingLoading.value = true
    await httpBackend(`/api/forums/removeForum/${props.forum.id}`, 'POST')
    toast({
      title: 'Succès',
      description:
        "Le forum a bien été supprimé. Il sera encore visible par les utilisateurs pendant un petit moment, mais ils n'arriveront pas à y accéder.",
      variant: 'default'
    })
    emit('removeForum', props.forum.id)
    props.forum = null
  } catch (error) {
    error.toString()
    toast({
      title: 'Erreur',
      description: 'Une erreur est survenue lors de la suppression du forum : ' + error.message,
      variant: 'destructive'
    })
    console.error('Error while removing forum', error)
  } finally {
    removingLoading.value = false
  }
}
</script>

<template>
  <Card class="self-start hover:bg-secondary transition">
    <CardHeader>
      <CardTitle v-if="!editingForum">{{ forum.name }}</CardTitle>
      <div v-else class="flex flex-row justify-start gap-3">
        <!-- Edit title -->
        <Input v-model="forum.name" @click.prevent @keydown.enter.prevent="sendForumModifcation" />
        <ForumSaveButton :is-loading="editingLoading" @click.prevent="sendForumModifcation" />
      </div>
    </CardHeader>
    <CardFooter v-if="isAdmin" class="flex flex-row justify-end gap-1.5">
      <ForumEditButton @click.prevent="editForum" />
      <ForumDeleteButton @click.prevent="removeForum" :is-loading="removingLoading" />
    </CardFooter>
  </Card>
</template>

<style scoped></style>
