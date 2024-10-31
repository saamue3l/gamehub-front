<script setup lang="ts">
import { Button, type ButtonVariants } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast'
import { type Event } from '@/types/Event'
import { httpBackend } from '@/lib/utils'
import { computed, ref } from 'vue'
import { comment } from 'postcss'
import LoadingSpinner from '@/components/ui/feedback/spinner/LoadingSpinner.vue'
import type { User } from '@/types/User'

const emit = defineEmits<{
  (e: 'joined-event', event: Event): void
}>()

const isLoading = ref(false)
const buttonText = computed<string>(() =>
  props.event.userJoined === true ? "Annuler l'inscription" : "Rejoindre l'évènement"
)
const buttonVariant = computed<ButtonVariants['variant']>(() => {
  if (isLoading.value) {
    return 'ghost'
  }
  return props.event.userJoined === true ? 'secondary' : 'default'
})
const buttonDisabled = computed<boolean>(() => {
  return (
    isLoading.value ||
    (props.event.participants.length >= props.event.maxPlayers && !props.event.userJoined)
  )
})

const props = defineProps<{
  event: Event
}>()

const { toast } = useToast()
async function onClick() {
  let response
  try {
    isLoading.value = true
    response = (await httpBackend(`/api/event/changeJoinedStatus/${props.event.id}`, 'POST')) as any

    const userJoined: boolean = response.userJoined
    let toastMessage
    if (userJoined) {
      toastMessage = `Vous êtes inscrit à l'évènement ${props.event.name}`
    } else {
      toastMessage = `Vous êtes désinscrit de l'évènement ${props.event.name}`
    }
    toast({
      title: 'Succès !',
      description: toastMessage,
      variant: 'default'
    })

    props.event.userJoined = userJoined
    userJoined ? props.event.participants.push({} as User) : props.event.participants.pop() // TODO utiliser le vrai objet utilisateur

    emit('joined-event', props.event)
  } catch (error) {
    console.error('Error while joining event : ', error.toString())
    const errorMessage =
      error.message || "Il y a eu un problème lors de l'inscription/désinscription à l'évènement."
    toast({
      title: 'Oups !',
      description: errorMessage,
      variant: 'destructive'
    })
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <Button :variant="buttonVariant" @click="onClick" :disabled="buttonDisabled">
    {{ buttonText.toUpperCase() }}
    <LoadingSpinner v-if="isLoading" size="md" class="ml-1.5" />
  </Button>
</template>
