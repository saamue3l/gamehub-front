<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogHeader,
  DialogScrollContent,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { useToast } from '@/components/ui/toast'
import { eventCreateSchema } from '@/types/Event'
import { httpBackend } from '@/lib/utils'
import { Textarea } from '@/components/ui/textarea'
import SearchGame from '@/components/layout/games/SearchGame.vue'
import DatePicker from '@/components/ui/inputs/datePicker/DatePicker.vue'
import type { DateValue } from '@internationalized/date'
import { ref } from 'vue'
import { useActionHandler } from '@/services/actionHandler'
import type { XpAndSuccessResponse } from '@/types/Success'

const modalIsOpened = ref<boolean>()
const isLoading = ref(false)

const emit = defineEmits<{
  (e: 'created-event'): void
}>()

const validationSchema = toTypedSchema(eventCreateSchema)

const { handleSubmit, setFieldValue } = useForm({
  validationSchema
})

const { toast } = useToast()
const onSubmit = handleSubmit(async (values) => {
  try {
    isLoading.value = true
    const response = await httpBackend<XpAndSuccessResponse>(
      '/api/event/createEvent',
      'POST',
      values
    )

    console.log('modal is opended before :', modalIsOpened.value)
    modalIsOpened.value = false
    console.log('modal is opended after :', modalIsOpened.value)
    emit('created-event')

    const { handleActionResponse } = useActionHandler()

    await handleActionResponse(response, {
      title: 'Succès',
      description: `L'évènement ${values.name} a été créé avec succès`
    })
  } catch (error) {
    console.error('Error while creating ne event : ', error)
    error.toString()
    const errorMessage =
      error.response?.data?.message || "Il y a eu un problème lors de la création de l'évènement."
    toast({
      title: 'Oups !',
      description: errorMessage,
      variant: 'destructive'
    })
  } finally {
    isLoading.value = false
  }
})

// Methods to handle custom component values
function handleSelectGame(game) {
  setFieldValue('gameId', game.id)
}

function handleDateChange(date: DateValue) {
  setFieldValue('eventDate', date.toDate())
}
</script>

<template>
  <Dialog v-model:open="modalIsOpened">
    <DialogTrigger as-child>
      <Button>{{ 'Créer un évènement'.toUpperCase() }}</Button>
    </DialogTrigger>
    <DialogScrollContent class="flex flex-col gap-3">
      <DialogHeader>
        <DialogTitle>Créer un évènement</DialogTitle>
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
              <SearchGame @select-game="handleSelectGame"></SearchGame>
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
                />
              </section>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <Button type="submit" size="form" :disabled="isLoading">
          {{ isLoading ? 'Création en cours...' : "Créer l'évènement" }}
        </Button>
      </form>
    </DialogScrollContent>
  </Dialog>
</template>
