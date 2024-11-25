<script setup lang="ts">
import { Textarea } from '@/components/ui/textarea'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { useToast } from '@/components/ui/toast'
import { httpBackend } from '@/lib/utils'
import ForumChildContainer from '@/components/layout/forums/ForumChildContainer.vue'
import { type CreateTopicResponse, type Topic, topicCreateSchema } from '@/types/Forum'
import { UserStore } from '@/store/userStore'
import type { User } from '@/types/User'
import { useActionHandler } from '@/services/actionHandler'
import { ref } from 'vue'

const props = defineProps<{
  forumId: number
}>()

const emit = defineEmits<{
  (e: 'created-topic', value: Topic): void
}>()

const userStore = UserStore()
const user = { username: userStore.username } as User
const isLoading = ref(false)

const validationSchema = toTypedSchema(topicCreateSchema)

const { handleSubmit } = useForm({
  validationSchema
})

const { toast } = useToast()
const onSubmit = handleSubmit(async (values) => {
  try {
    isLoading.value = true
    values.forumId = props.forumId
    const response = await httpBackend<CreateTopicResponse>(
      '/api/forums/createTopic',
      'POST',
      values
    )

    const { handleActionResponse } = useActionHandler()

    await handleActionResponse(response, {
      title: 'Succès',
      description: `Le sujet ${values.title} a été créé avec succès`
    })

    const newTopic: Topic = {
      id: response.topicId,
      title: values.title,
      posts: [
        {
          id: 1,
          content: values.content,
          creationDate: new Date(),
          user: user,
          reactions: []
        }
      ],
      creator: user
    }
    emit('created-topic', newTopic)
  } catch (error) {
    console.error('Error while creating new topic : ', error)
    error?.toString()
    console.log(error)
    const errorMessage = error?.message || 'Il y a eu un problème lors de la création du sujet.'
    toast({
      title: 'Oups !',
      description: errorMessage,
      variant: 'destructive'
    })
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <ForumChildContainer title="Nouveau sujet" :is-loading="false">
    <form class="space-y-6" @submit="onSubmit">
      <FormField v-slot="{ componentField }" name="title">
        <FormItem>
          <FormLabel>Titre du nouveau sujet</FormLabel>
          <FormControl>
            <Input
              type="text"
              placeholder="Titre du sujet"
              v-bind="componentField"
              :validate-on-blur="false"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="content">
        <FormItem>
          <FormLabel>Post initial</FormLabel>
          <FormControl>
            <Textarea
              type="text"
              placeholder="Contenu du post initial, de quoi voulez-vous parler ? Essayez de rester courtois et de rester dans le sujet du forum."
              v-bind="componentField"
              :validate-on-blur="false"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <Button type="submit" size="form" :disabled="isLoading">
        {{ isLoading ? 'Chargement...' : 'Poster' }}
      </Button>
    </form>
  </ForumChildContainer>
</template>

<style scoped></style>
