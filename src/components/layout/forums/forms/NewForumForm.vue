<script setup lang="ts">
import { Input } from '@/components/ui/input'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { useToast } from '@/components/ui/toast'
import { httpBackend } from '@/lib/utils'
import ForumChildContainer from '@/components/layout/forums/ForumChildContainer.vue'
import { type Forum, forumCreateSchema, type Post } from '@/types/Forum'

const emit = defineEmits<{
  (e: 'created-forum', forum: Forum): void
}>()

const validationSchema = toTypedSchema(forumCreateSchema)

const { handleSubmit } = useForm({
  validationSchema
})

const { toast } = useToast()
const onSubmit = handleSubmit(async (values) => {
  try {
    const response = await httpBackend<{ message: string; forumId: number }>(
      `/api/forums/createForum`,
      'POST',
      values
    )
    toast({
      title: 'Succès !',
      description:
        'Le forum a été créé avec succès. Il se peut que les utilisateurs ne le vois pas tout de suite.',
      variant: 'default'
    })

    const newForum: Forum = {
      id: response.forumId,
      name: values.name,
      topics: []
    }
    emit('created-forum', newForum)
  } catch (error) {
    console.error('Error while creating a new forum : ', error)
    error?.toString()
    const errorMessage =
      error?.response?.data?.message || 'Il y a eu un problème lors de la création du nouveau post.'
    toast({
      title: 'Oups !',
      description: errorMessage,
      variant: 'destructive'
    })
  }
})
</script>

<template>
  <ForumChildContainer title="Créer un nouveau forum" :is-loading="false">
    <form class="space-y-6" @submit="onSubmit">
      <FormField v-slot="{ componentField }" name="name">
        <FormItem>
          <FormLabel>Nom</FormLabel>
          <FormControl>
            <Input
              type="text"
              placeholder="Nom du forum"
              v-bind="componentField"
              :validate-on-blur="false"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <Button type="submit" size="form">Créer le nouveau forum</Button>
    </form>
  </ForumChildContainer>
</template>

<style scoped></style>
