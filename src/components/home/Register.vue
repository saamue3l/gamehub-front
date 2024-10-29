<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/toast'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { fetchRegisterPost } from '@/api/fetchRegisterPost'
import { registerPostSchema } from '@/types/Register'
import router from '@/router/index.js'
import { UserStore } from '@/store/userStore'

const validationSchema = toTypedSchema(registerPostSchema)

const { handleSubmit } = useForm({
  validationSchema
})

const userStore = UserStore()

const { toast } = useToast()
const onSubmit = handleSubmit(async (values) => {
  try {
    const response = await fetchRegisterPost(values)
    console.log(response)
    toast({
      title: 'Succès !',
      description: response.message,
      variant: 'default'
    })
    userStore.setUsername(values.username)
    await router.push({ name: 'Profil' })
  } catch (error) {
    error.toString()
    const errorMessage =
      error.response?.data?.message || 'Il y a eu un problème avec votre requête.'
    toast({
      title: 'Oups !',
      description: errorMessage,
      variant: 'destructive'
    })
  }
})
</script>

<template>
  <form class="space-y-6" @submit="onSubmit">
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

    <FormField v-slot="{ componentField }" name="username">
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

    <FormField v-slot="{ componentField }" name="password">
      <FormItem>
        <FormLabel>Mot de passe</FormLabel>
        <FormControl>
          <Input
            type="password"
            placeholder="Votre mot de passe"
            v-bind="componentField"
            :validate-on-blur="false"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="passwordConfirm">
      <FormItem>
        <FormLabel>Confirmer votre mot de passe</FormLabel>
        <FormControl>
          <Input type="password" placeholder="Confirmer le mot de passe" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <Button type="submit" size="form"> S'inscrire </Button>
  </form>
</template>

<style scoped></style>
