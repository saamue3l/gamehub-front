<script setup lang="ts">
import { Badge } from '@/components/ui/badge'
import { SmilePlus as SmilePlusIcon } from 'lucide-vue-next'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useReactionTypesStore } from '@/store/reactionTypesStore'
import { computed, ref } from 'vue'
import type { Reaction } from '@/types/Forum'
import LoadingSpinner from '@/components/ui/feedback/spinner/LoadingSpinner.vue'
import { UserStore } from '@/store/userStore'
import type { User } from '@/types/User'

const props = defineProps<{
  reactions: Reaction[]
}>()

const emit = defineEmits<{
  (e: 'update:reaction', reaction: Reaction): void
}>()

const reactionTypesStore = useReactionTypesStore()
const isAddingEmojiLoading = ref<boolean>(false)

const userStore = UserStore()
const user = { username: userStore.username } as User

function loadReactionTypes() {
  reactionTypesStore.fetchAllPossibleReactions()
}

function reactionOnClick(reaction: Reaction) {
  if (reaction.userReacted(user)) {
    reaction.removeUser(user)
  } else {
    reaction.addUser(user)
  }
  emit('update:reaction', reaction)
}
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <Badge
        variant="outline"
        class="select-none cursor-pointer hover:bg-secondary flex flex-row justify-center items-center gap-1"
      >
        <SmilePlusIcon class="w-[15px] h-[15px]" />
      </Badge>
    </PopoverTrigger>
    <PopoverContent @open-auto-focus="loadReactionTypes" class="w-min">
      <div class="flex flex-row justify-center gap-1.5">
        <LoadingSpinner
          size="icon"
          v-if="reactionTypesStore.isLoading || isAddingEmojiLoading"
          class="h-[20px] w-[30px]"
        />

        <Badge
          v-else
          v-for="reaction in reactions"
          :key="reaction.emoji"
          variant="outline"
          class="select-none cursor-pointer hover:bg-secondary"
          @click="() => reactionOnClick(reaction)"
        >
          {{ reaction.emoji }}
        </Badge>
      </div>
    </PopoverContent>
  </Popover>
</template>

<style scoped></style>
