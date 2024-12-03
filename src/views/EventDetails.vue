<script setup lang="ts">
import BasePage from '@/components/layout/BasePage.vue'
import { useRoute, useRouter } from 'vue-router'
import { httpBackend } from '@/lib/utils'
import { onMounted, ref } from 'vue'
import { useToast } from '@/components/ui/toast'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { Event } from '@/types/Event'
import { Skeleton } from '@/components/ui/skeleton'
import GameCover from '@/components/layout/games/GameCover.vue'
import { IGDBImageSizes } from '@/lib/igdbImages'
import EventParticipantCard from '@/components/layout/events/EventParticipantCard.vue'
import JoinEventButton from '@/components/layout/events/JoinEventButton.vue'
import { UserStore } from '@/store/userStore'
import type { User } from '@/types/User'
import BackButton from '@/components/ui/button/BackButton.vue'
import { Calendar as CalendarIcon, Gamepad2 } from 'lucide-vue-next'
import UsersIcon from '@/components/icons/usersIcon.vue'
import DeleteButton from '@/components/ui/button/DeleteButton.vue'
import ModifyEventButton from '@/components/layout/events/ModifyEventButton.vue'
import ConfirmationDialog from '@/components/ui/dialog/ConfirmationDialog.vue'

const router = useRouter()
const route = useRoute()
const eventId = route.params.eventId
const userStore = UserStore()
const currentUser: User = { username: userStore.username }

const isLoading = ref(true)
const deleteIsLoading = ref(false)
const event = ref<Event | null>(null)

const { toast } = useToast()
async function fethEventDetails() {
  isLoading.value = true
  try {
    event.value = await httpBackend(`/api/event/${eventId}`, 'GET')
  } catch (error) {
    console.error('Error while retrieving event details : ', error.toString())
    const errorMessage =
      error.message ||
      "Il y a eu un problème lors de la récupérations des informations de l'évènement."
    toast({
      title: 'Oups !',
      description: errorMessage,
      variant: 'destructive'
    })
  } finally {
    isLoading.value = false
  }
}

function onUserJoinedEvent(newEvent, userJoined) {
  if (userJoined) {
    event.value.participants.push(currentUser)
  } else {
    event.value.participants = event.value.participants.filter(
      (participant) => participant.username !== currentUser.username
    )
  }
}

onMounted((): void => {
  fethEventDetails()
})

async function onDeleted() {
  deleteIsLoading.value = true
  try {
    await httpBackend(`/api/event/deleteEvent/${eventId}`, 'POST')
    toast({
      title: 'Succès',
      description: "L'évènement a été supprimé avec succès."
    })
    router.push(route.query.ref ?? { name: 'Évènements' })
  } catch (error) {
    toast({
      title: 'Erreur',
      description: error.message ?? "Il y a eu un problème lors de la suppression de l'évènement.",
      variant: 'destructive'
    })
  } finally {
    deleteIsLoading.value = false
  }
}
</script>

<template>
  <BasePage title="Détails Évènement">
    <BackButton :to="route.query.ref as string" />

    <Skeleton v-if="isLoading" class="w-full h-[600px]" />

    <Card v-else-if="event">
      <!--   === NAME ===    -->
      <CardHeader>
        <CardTitle>{{ event.name }}</CardTitle>
      </CardHeader>

      <CardContent>
        <!--   === DESCRIPTION ===    -->
        <CardDescription>
          {{ event.description }}
        </CardDescription>
      </CardContent>

      <CardContent>
        <!--   === GAME ===    -->
        <div class="w-full flex justify-stretch items-stretch gap-3 flex-wrap">
          <div class="flex-1 flex flex-col">
            <CardTitle :level="2"
              ><Gamepad2 class="text-primary inline" /> {{ event.game.name }}</CardTitle
            >
            <GameCover
              :game="event.game"
              :image-size="IGDBImageSizes.COVER_BIG"
              class="py-2 block max-w-full w-min min-w-[200px] h-auto"
            />
          </div>
          <div class="flex-1 flex flex-col justify-between">
            <!--   === DATE ===    -->
            <CardContent>
              <CardTitle :level="2"><CalendarIcon class="text-primary inline" /> Date</CardTitle>
              <p class="py-2">{{ new Date(Date.parse(event.eventDate)).toDateString() }}</p>
            </CardContent>
            <!--   === PARTICIPANTS ===    -->
            <CardContent>
              <CardTitle :level="2">
                <UsersIcon class="text-primary inline" /> Participants :
                {{ event.participants.length }} /
                {{ event.maxPlayers }}
              </CardTitle>
              <div class="flex flex-wrap gap-2 py-2">
                <EventParticipantCard
                  :user="participant"
                  :is-creator="participant.id == event.creator.id"
                  :is-user="participant.username == currentUser.username"
                  v-for="participant in event.participants"
                />
              </div>
            </CardContent>
            <!--   === EDIT / DELETE ===    -->
            <CardContent
              v-if="event.creator.username == currentUser.username || userStore.isAdmin()"
            >
              <CardTitle :level="2">Actions</CardTitle>
              <div class="flex flex-row gap-1.5 py-2">
                <ModifyEventButton :event="event" @modified-event="fethEventDetails" />
                <ConfirmationDialog
                  title="Suppression de l'évènement"
                  :on-confirm="onDeleted"
                  :message="`Êtes-vous certains de vouloir supprimer l'évènement &quot;${event.name}&quot; ?`"
                  confirm-button-text="Supprimer"
                  confirm-button-variant="destructive"
                  :is-loading="deleteIsLoading"
                >
                  <DeleteButton :forum="event" />
                </ConfirmationDialog>
              </div>
            </CardContent>
            <!--   === JOIN BUTTON ===    -->
            <CardContent class="flex-1 flex flex-col justify-end">
              <div class="flex justify-end">
                <JoinEventButton :event="event" @joined-event="onUserJoinedEvent" />
              </div>
            </CardContent>
          </div>
        </div>
      </CardContent>
    </Card>
  </BasePage>
</template>

<style scoped></style>
