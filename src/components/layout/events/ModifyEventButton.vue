<script setup lang="ts">
import EditButton from '@/components/ui/button/EditButton.vue'
import {
  Dialog,
  DialogHeader,
  DialogScrollContent,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import DatePicker from '@/components/ui/inputs/datePicker/DatePicker.vue'
import SearchGame from '@/components/layout/games/SearchGame.vue'
import { Button } from '@/components/ui/button'
import { type Event, eventCreateSchema } from '@/types/Event'
import { computed, onMounted, ref, watch } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { CalendarDate, type DateValue } from '@internationalized/date'
import type { Game } from '@/types/Game'
import { UserStore } from '@/store/userStore'
import { useToast } from '@/components/ui/toast'
import { httpBackend } from '@/lib/utils'
import type { XpAndSuccessResponse } from '@/types/Success'

const modalIsOpened = ref(false)
const isLoading = ref(false)
const { toast } = useToast()

const props = defineProps<{
  event: Event
}>()

const emit = defineEmits<{
  (e: 'modified-event', event: Event): void
}>()

const { handleSubmit, resetForm, setFieldValue, values } = useForm({
  validationSchema: toTypedSchema(eventCreateSchema),
  initialValues: props.event
})

const onSubmit = handleSubmit(async (values) => {
  isLoading.value = true
  try {
    const response = await httpBackend<null>(
      `/api/event/modifyEvent/${props.event.id}`,
      'POST',
      values
    )

    modalIsOpened.value = false

    const modifiedEvent = {
      ...props.event,
      ...values
    }

    toast({
      title: 'Succès',
      description: `L'évènement ${values.name} a été modifié avec succès`
    })

    emit('modified-event', modifiedEvent)
  } catch (error) {
    toast({
      title: "Erreur lors de la modification de l'évènement",
      description: error.message,
      variant: 'destructive'
    })
  } finally {
    isLoading.value = false
  }
})

// Methods to handle custom component values
function handleSelectGame(game) {
  if (game == null) return null

  setFieldValue('gameId', game.id)
}

const game = ref<Game>(props.event.game)
const selectedGame = computed<Game>({
  get: () => game.value,
  set: (val) => val
})

function handleDateChange(eventDate: DateValue) {
  setFieldValue('eventDate', eventDate.toDate())
}

const eventDate = computed({
  get: () => {
    let date = new Date(Date.parse(values.eventDate))
    return values.eventDate
      ? new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate())
      : undefined
  },
  set: (val) => val
})

watch(
  () => modalIsOpened.value,
  (isOpened: boolean) => {
    if (isOpened) {
      resetForm({
        values: {
          name: props.event.name,
          gameId: props.event.game.id,
          description: props.event.description,
          maxPlayers: props.event.maxPlayers,
          eventDate: props.event.eventDate
        }
      })
    }
  }
)

watch(
  () => values,
  (newValues) => {
    console.log('Values changed : ', newValues)
  }
)

onMounted(() => {
  props.event.eventDate = new Date(Date.parse(props.event.eventDate)) // Setting the date as a Date object
})
</script>

<template>
  <Dialog v-model:open="modalIsOpened">
    <DialogTrigger>
      <EditButton />
    </DialogTrigger>
    <DialogScrollContent class="flex flex-col gap-3">
      <DialogHeader>
        <DialogTitle>Modifier l'évènement "{{ event.name }}"</DialogTitle>
      </DialogHeader>

      <form class="space-y-6" @submit="onSubmit">
        <FormField v-slot="{ componentField }" name="name">
          <FormItem>
            <FormLabel>Nom</FormLabel>
            <FormControl>
              <Input
                type="text"
                placeholder="Nom de l'évènement"
                v-bind="componentField"
                :validate-on-blur="false"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField name="gameId">
          <FormItem>
            <FormLabel>Jeu de l'évènement</FormLabel>
            <FormControl>
              <SearchGame @select-game="handleSelectGame" v-model="game" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="description">
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                type="text"
                placeholder="Description de l'évènement. Qu'est-ce qu'il s'y passera ? Quelle est l'organisation ?"
                v-bind="componentField"
                :validate-on-blur="false"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="maxPlayers">
          <FormItem>
            <FormLabel>Nombre de participants maximum</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Nb de participants max"
                v-bind="componentField"
                :validate-on-blur="false"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField name="eventDate">
          <FormItem>
            <FormLabel>Date de l'évènement</FormLabel>
            <FormControl>
              <section>
                <DatePicker
                  type="date"
                  placeholder="Date de l'évènement"
                  @update:model-value="handleDateChange"
                  v-model="eventDate"
                />
              </section>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <Button type="submit" size="form" :disabled="isLoading">
          {{ isLoading ? 'Modification en cours...' : "Modifier l'évènement" }}
        </Button>
      </form>
    </DialogScrollContent>
  </Dialog>
</template>

<style scoped></style>
