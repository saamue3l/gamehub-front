<script setup lang="ts">
import { Reaction } from '@/types/Forum'
import { Badge, type BadgeVariants } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import LoadingSpinner from '@/components/ui/feedback/spinner/LoadingSpinner.vue'
import { computed, ref } from 'vue'
import { UserStore } from '@/store/userStore'
import type { User } from '@/types/User'

const props = defineProps<{
  reaction: Reaction
}>()

const emit = defineEmits<{
  (e: 'update:reaction', reaction: Reaction): void
}>()

const userStore = UserStore()
const user = { username: userStore.username } as User

const isLoading = ref<boolean>(false)
const userReacted = computed(() => {
  return props.reaction.users.some((u) => u.username === user.username)
})
const reactionBadgeVariant = computed<BadgeVariants['variant']>(() => {
  if (userReacted.value) {
    return 'default'
  } else {
    return 'outline'
  }
})

function reactionOnClick(emoji: string) {
  if (props.reaction?.userReacted(user)) {
    props.reaction.removeUser(user)
  } else {
    props.reaction.addUser(user)
  }
  emit('update:reaction', props.reaction)
}
</script>

<template>
  <TooltipProvider v-if="reaction.users.length > 0">
    <Tooltip>
      <TooltipTrigger as-child>
        <Badge
          :variant="reactionBadgeVariant"
          :class="[
            'select-none cursor-pointer hover:bg-secondary flex flex-row justify-center items-center gap-1',
            { 'bg-gray-500 cursor-wait': isLoading }
          ]"
          @click="() => reactionOnClick(reaction.emoji)"
        >
          {{ reaction.emoji }}
          <LoadingSpinner size="sm" v-if="isLoading" />
          <span v-else-if="reaction.users.length > 1">
            {{ reaction.users.length }}
          </span>
        </Badge>
      </TooltipTrigger>
      <TooltipContent>
        {{ reaction.users.map((u) => u.username).join(', ') }}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>

<style scoped></style>
