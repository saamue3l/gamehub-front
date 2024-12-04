<script setup lang="ts">
import { type Post, Reaction } from '@/types/Forum'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import SmallUserCardLink from '@/components/layout/user/SmallUserCardLink.vue'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import PostReaction from '@/components/layout/forums/PostReaction.vue'
import AddPostReaction from '@/components/layout/forums/AddPostReaction.vue'
import { computed, ref } from 'vue'
import { useReactionTypesStore } from '@/store/reactionTypesStore'
import { reactionToPost } from '@/components/layout/forums/reactToPost'
import { UserStore } from '@/store/userStore'
import type { User } from '@/types/User'
import { highlightSearch, httpBackend } from '@/lib/utils'
import ForumEditButton from '@/components/ui/button/EditButton.vue'
import ForumDeleteButton from '@/components/ui/button/DeleteButton.vue'
import { toast } from '@/components/ui/toast'
import { Textarea } from '@/components/ui/textarea'
import SaveButton from '@/components/ui/button/SaveButton.vue'
import EditButton from '@/components/ui/button/EditButton.vue'
import DeleteButton from '@/components/ui/button/DeleteButton.vue'
import ConfirmationDialog from '@/components/ui/dialog/ConfirmationDialog.vue'

const props = withDefaults(
  defineProps<{
    post: Post
    search?: string
    showReactions?: boolean
  }>(),
  {
    showReactions: true
  }
)

const emit = defineEmits<{
  (e: 'removePost', forumId: number): void
}>()

const reactionTypesStore = useReactionTypesStore()
const userStore = UserStore()

const user = { username: userStore.username } as User
const isAdmin = userStore.isAdmin
console.log('isAdmin dans PostCard', isAdmin)
const isReactionLoading = ref<boolean>(false)
reactionTypesStore.fetchAllPossibleReactions()

const allReactions = computed<Reaction[]>(() => {
  props.post.reactions && reactionTypesStore.reactionTypes
  if (!props.post.reactions || !props.showReactions) return []
  let allReactions: Reaction[] = []
  if (!reactionTypesStore.reactionTypes) return allReactions
  for (let reactionEmoji of reactionTypesStore.reactionTypes) {
    let existingReaction: Reaction | undefined = props.post.reactions.find(
      (r) => r.emoji == reactionEmoji
    )
    if (existingReaction) {
      allReactions.push(new Reaction(existingReaction.emoji, existingReaction.users))
    } else {
      allReactions.push(new Reaction(reactionEmoji, []))
    }
  }

  return allReactions
})

function changeReactionState(reaction: Reaction) {
  reactionToPost(reaction.emoji, isReactionLoading, props.post)
}

const editingPost = ref<boolean>(false)
const editingLoading = ref<boolean>(false)
const removingLoading = ref<boolean>(false)

function editPost() {
  editingPost.value = !editingPost.value
}

async function sendPostModifcation() {
  if (editingLoading.value) return
  try {
    editingLoading.value = true
    await httpBackend(`/api/forums/editPost/${props.post.id}`, 'POST', {
      content: props.post.content
    })
    toast({
      title: 'Succès',
      description: 'Le post a bien été modifié.',
      variant: 'default'
    })
    editingPost.value = false
  } catch (error) {
    error.toString()
    toast({
      title: 'Erreur',
      description: 'Une erreur est survenue lors de la modification du post : ' + error.message,
      variant: 'destructive'
    })
    console.error("Error while editing post's content", error)
  } finally {
    editingLoading.value = false
  }
}

async function removePost() {
  if (removingLoading.value) return
  try {
    removingLoading.value = true
    await httpBackend(`/api/forums/removePost/${props.post.id}`, 'POST')
    toast({
      title: 'Succès',
      description: 'Le post a bien été supprimé.',
      variant: 'default'
    })
    emit('removePost', props.post.id)
  } catch (error) {
    error.toString()
    toast({
      title: 'Erreur',
      description: 'Une erreur est survenue lors de la suppression du post : ' + error.message,
      variant: 'destructive'
    })
    console.error('Error while removing post : ', error)
  } finally {
    removingLoading.value = false
  }
}
</script>

<template>
  <Card>
    <CardHeader>
      <header class="flex justify-start gap-5 flex-wrap">
        <SmallUserCardLink :user="post.user" />

        <!--   Date   -->
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger as-child>
              <article class="text-sm text-muted-foreground flex gap-1 items-center">
                {{ new Date(post.creationDate).toLocaleDateString() }}
              </article>
            </TooltipTrigger>
            <TooltipContent align="center" side="top"
              ><p>{{ new Date(post.creationDate).toDateString() }}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </header>
    </CardHeader>
    <!--  CONTENT  -->
    <CardContent v-if="!editingPost" v-html="highlightSearch(post.content, search)" />
    <CardContent v-else class="flex flex-row justify-start gap-3">
      <!-- Edit content -->
      <Textarea v-model="post.content" @keydown.enter.prevent="sendPostModifcation" />
      <SaveButton :is-loading="editingLoading" @click="sendPostModifcation" />
    </CardContent>
    <CardFooter v-if="props.showReactions" class="w-full flex flex-row justify-between flex-wrap">
      <div id="reactionsContainer" class="flex justify-start gap-1.5 flex-wrap">
        <!-- Afficher les réactions existantes -->
        <PostReaction
          v-for="reaction in allReactions.filter((r) => r.users.length > 0)"
          :key="reaction.emoji"
          :reaction="reaction"
          @update:reaction="(value) => changeReactionState(value)"
        />

        <!-- Masquer le bouton d'ajout de réaction si c'est notre post -->
        <AddPostReaction
          v-if="
            post.user.username !== userStore.username &&
            allReactions.filter((r) => r.users.length == 0).length > 0
          "
          :reactions="allReactions.filter((r) => r.users.length == 0)"
          @update:reaction="
            (value) => {
              props.post.reactions.push(value)
              changeReactionState(value)
            }
          "
        />
      </div>
      <div
        v-if="isAdmin || props.post.user.username == user.username"
        class="flex flex-row justify-end gap-1.5"
      >
        <EditButton @click="editPost" />
        <ConfirmationDialog
          title="Suppression du post"
          :on-confirm="removePost"
          :message="`Êtes-vous certains de vouloir supprimer le post de ${post.user.username} ?`"
          confirm-button-text="Supprimer"
          confirm-button-variant="destructive"
          :is-loading="removingLoading"
        >
          <DeleteButton />
        </ConfirmationDialog>
      </div>
    </CardFooter>
  </Card>
</template>

<style scoped></style>
