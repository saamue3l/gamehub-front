import { httpBackend } from '@/lib/utils'
import { type Ref } from 'vue'
import type { Post, ReactionResponse } from '@/types/Forum'
import { useToast } from '@/components/ui/toast'
import { useActionHandler } from '@/services/actionHandler'

export async function reactionToPost(emoji: string, isLoading: Ref<boolean>, post: Post) {
  if (isLoading.value) {
    return
  }

  try {
    isLoading.value = true

    const values = {
      emoji: emoji
    }

    const response = await httpBackend<ReactionResponse>(
      `/api/forums/react/${post.id}`,
      'POST',
      values
    )

    console.log('response:', response)
    const { handleActionResponse } = useActionHandler()

    await handleActionResponse(response)
  } catch (error: any) {
    error.toString()
    const errorMessage =
      error.response?.data?.message ||
      "Il y a eu un problème lors de l'interaction avec la réaction."
    useToast().toast({
      title: 'Oups !',
      description: errorMessage,
      variant: 'destructive'
    })
    console.error('Error changing user reaction state:', error)
  } finally {
    isLoading.value = false
  }
}
