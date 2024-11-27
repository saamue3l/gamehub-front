<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { useToast } from '@/components/ui/toast/use-toast'
import { toTypedSchema } from '@vee-validate/zod'
import { ref } from 'vue'
import { type ChangePasswordPost, changePasswordSchema } from '@/types/Register'
import { httpBackend } from '@/lib/utils'
import { useForm } from 'vee-validate'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const { toast } = useToast()
const isDialogOpen = ref(false)

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(changePasswordSchema),
  initialValues: {
    current_password: '',
    password: '',
    password_confirmation: ''
  }
})

const isLoading = ref(false)

const onSubmit = handleSubmit(async (values: ChangePasswordPost) => {
  try {
    isLoading.value = true

    await httpBackend<void>('/api/user/password', 'POST', values)

    toast({
      title: 'Mot de passe modifié',
      description: 'Votre mot de passe a été modifié avec succès'
    })

    isDialogOpen.value = false
  } catch (error) {
    console.error('Erreur:', error)
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
  <Dialog v-model:open="isDialogOpen">
    <DialogTrigger as-child>
      <Button variant="secondary" class="w-full">Modifier le mot de passe</Button>
    </DialogTrigger>

    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Modifier le mot de passe</DialogTitle>
        <DialogDescription>
          Entrez votre mot de passe actuel et votre nouveau mot de passe.
        </DialogDescription>
      </DialogHeader>

      <form @submit.prevent="onSubmit" class="space-y-4">
        <FormField v-slot="{ componentField }" name="current_password">
          <FormItem>
            <FormLabel>Mot de passe actuel</FormLabel>
            <FormControl>
              <Input
                type="password"
                placeholder="********"
                v-bind="componentField"
                :validate-on-blur="false"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="password">
          <FormItem>
            <FormLabel>Nouveau mot de passe</FormLabel>
            <FormControl>
              <Input
                type="password"
                placeholder="********"
                v-bind="componentField"
                :validate-on-blur="false"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="password_confirmation">
          <FormItem>
            <FormLabel>Confirmer le nouveau mot de passe</FormLabel>
            <FormControl>
              <Input
                type="password"
                placeholder="********"
                v-bind="componentField"
                :validate-on-blur="false"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <DialogFooter>
          <Button type="button" variant="outline" @click="isDialogOpen = false"> Annuler </Button>
          <Button type="submit" :disabled="isLoading">
            {{ isLoading ? 'Enregistrement...' : 'Enregistrer' }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
