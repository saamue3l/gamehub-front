<script setup lang="ts">
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { onMounted, ref } from 'vue'
import { UserStore } from '@/store/userStore'
import { useToast } from '@/components/ui/toast/use-toast'
import {
  type RegisterResponse,
  type UpdateProfilePost,
  updateProfileSchema
} from '@/types/Register'
import { httpBackend, httpBackendWithData } from '@/lib/utils'
import EditPasswordComponent from '@/components/layout/editProfile/EditPasswordComponent.vue'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import type { GetUserResponse } from '@/types/User'
import ProfileImageInput from '@/components/ui/ProfileImageInput.vue'
import { Skeleton } from '@/components/ui/skeleton'

const userStore = UserStore()
const { toast } = useToast()
const isLoadingInitialData = ref(true)
const isLoading = ref(false)

const { handleSubmit, resetForm, setFieldValue } = useForm({
  validationSchema: toTypedSchema(updateProfileSchema),
  initialValues: {
    email: '',
    username: '',
    picture: undefined
  }
})

onMounted(async () => {
  try {
    isLoadingInitialData.value = true
    const userData = await httpBackend<GetUserResponse>('/api/user/getUser', 'GET')

    resetForm({
      values: {
        email: userData.email,
        username: userData.username,
        picture: undefined
      }
    })
  } catch (error) {
    console.error('Error loading user data:', error)
    toast({
      title: 'Erreur lors du chargement des données',
      description: (error as Error).message,
      variant: 'destructive'
    })
  } finally {
    isLoadingInitialData.value = false
  }
})

const profilePictureFile = ref<File | null>(null)

const handleProfilePictureFile = (file: File | null) => {
  profilePictureFile.value = file
  setFieldValue('picture', file || undefined)
}

const handleProfilePictureError = (error: Error) => {
  toast({
    title: 'Erreur',
    description: error.message,
    variant: 'destructive'
  })
}

const onSubmit = handleSubmit(async (values: UpdateProfilePost) => {
  try {
    isLoading.value = true
    const formData = new FormData()

    if (values.email) formData.append('email', values.email)
    if (values.username) formData.append('username', values.username)
    if (profilePictureFile.value) formData.append('picture', profilePictureFile.value)

    const response = await httpBackendWithData<RegisterResponse>('/api/user/update', formData)

    if (values.username) {
      localStorage.setItem('username', values.username)
      userStore.setUsername(values.username)
    }

    if (response.picture) {
      localStorage.setItem('picture', response.picture.toString())
      userStore.setProfilePicture(response.picture)
    }

    toast({
      title: 'Profil mis à jour',
      description: 'Vos modifications ont été enregistrées avec succès'
    })
  } catch (error) {
    toast({
      title: 'Erreur lors de la mise à jour',
      description: (error as Error).message,
      variant: 'destructive'
    })
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <main
    class="max-md:w-full max-md:p-2 max-md:mt-20 pt-10 w-2/5 flex-grow flex items-center justify-center"
  >
    <div class="h-full w-full flex flex-col justify-center items-center z-10">
      <Card class="w-full">
        <CardHeader>
          <CardTitle>Modifier mon profil</CardTitle>
        </CardHeader>

        <CardContent v-if="isLoadingInitialData" class="space-y-4">
          <div v-for="i in 3" :key="i" class="space-y-2">
            <Skeleton class="h-4 w-24" />
            <Skeleton class="h-10 w-full" />
          </div>
        </CardContent>

        <form v-else @submit="onSubmit" class="w-full">
          <CardContent class="flex flex-col gap-y-4">
            <FormField v-slot="{ componentField }" name="email">
              <FormItem>
                <FormLabel>Adresse email</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Votre addresse email"
                    v-bind="componentField"
                    :validate-on-blur="false"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="username" class="mb-2">
              <FormItem>
                <FormLabel>Pseudo</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Votre nom d'utilisateur"
                    v-bind="componentField"
                    :validate-on-blur="false"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <ProfileImageInput
              name="picture"
              label="Photo de profil"
              :maxSize="5"
              :aspectRatio="1"
              @file-changed="handleProfilePictureFile"
              @error="handleProfilePictureError"
            />

            <EditPasswordComponent />
          </CardContent>
          <CardFooter class="flex justify-between">
            <Button type="submit" class="w-full" :disabled="isLoading">
              {{ isLoading ? 'Enregistrement...' : 'Enregistrer' }}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  </main>
</template>
