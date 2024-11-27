<script setup lang="ts">
import { Textarea } from '@/components/ui/textarea'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { useToast } from '@/components/ui/toast'
import { httpBackend } from '@/lib/utils'
import ForumChildContainer from '@/components/layout/forums/ForumChildContainer.vue'
import { type CreatePostResponse, type Post, postCreateSchema, type Topic } from '@/types/Forum'
import { UserStore } from '@/store/userStore'
import type { User } from '@/types/User'
import { useActionHandler } from '@/services/actionHandler'
import { computed, ref } from 'vue'

const props = defineProps<{
  topic: Topic
}>()

const emit = defineEmits<{
  (e: 'created-post', post: Post): void
}>()

const userStore = UserStore()
const user = { username: userStore.username } as User
const isLoading = ref(false)
const validationSchema = toTypedSchema(postCreateSchema)

const { handleSubmit, resetForm, values } = useForm({
  validationSchema,
  initialValues: {
    content: ''
  }
})

const { toast } = useToast()
const onSubmit = handleSubmit(async (values) => {
  try {
    isLoading.value = true
    const response = await httpBackend<CreatePostResponse>(
      `/api/forums/createPost/${props.topic.id}`,
      'POST',
      values
    )

    console.log('Response from createPost : ', response)
    const { handleActionResponse } = useActionHandler()

    await handleActionResponse(response, {
      title: 'Succès',
      description: response.message ?? 'Le post a été ajouté avec succès'
    })

    const newPost: Post = {
      id: response.postId,
      content: values.content,
      creationDate: new Date(),
      user: user,
      reactions: []
    }

    resetForm()

    console.log('Emitting created-post event with new post : ', newPost)
    emit('created-post', newPost)
  } catch (error) {
    console.error('Error while creating a new post : ', error)
    error?.toString()
    const errorMessage =
      error?.response?.data?.message || 'Il y a eu un problème lors de la création du nouveau post.'
    toast({
      title: 'Oups !',
      description: errorMessage,
      variant: 'destructive'
    })
  } finally {
    isLoading.value = false
  }
})

const isSubmitDisabled = computed(() => {
  return isLoading.value || !values.content?.trim()
})
</script>

<template>
  <ForumChildContainer title="Nouveau message" :is-loading="false">
    <form class="space-y-6" @submit="onSubmit">
      <FormField v-slot="{ componentField }" name="content">
        <FormItem>
          <FormLabel>Message</FormLabel>
          <FormControl>
            <Textarea
              type="text"
              placeholder="Contenu du post. Veuillez rester courtois et dans le sujet."
              v-bind="componentField"
              :validate-on-blur="false"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <Button type="submit" size="form" :disabled="isSubmitDisabled">
        {{ isLoading ? 'Chargement...' : 'Poster' }}
      </Button>
    </form>
  </ForumChildContainer>
</template>

<style scoped></style>
