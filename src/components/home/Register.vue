<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/toast'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { postRegister } from '@/api/postRegister'
import { registerPostSchema } from '@/types/Register'
import router from '@/router/index.js'
import { UserStore } from '@/store/userStore'
import { ref } from 'vue'

const validationSchema = toTypedSchema(registerPostSchema)

const { handleSubmit } = useForm({
  validationSchema
})

const userStore = UserStore()

const isLoading = ref(false)

const { toast } = useToast()
const onSubmit = handleSubmit(async (values) => {
  try {
    isLoading.value = true
    const response = await postRegister(values)

    toast({
      title: 'Succès !',
      description: response.message,
      variant: 'default'
    })

    userStore.setUsername(values.username)
    userStore.setXp(values.xp)
    await router.push({ name: 'Profil', params: { username: userStore.username } })
  } catch (error) {
    toast({
      title: "Quelque chose n'a pas fonctionné.",
      description: 'Une erreur est survenue, veuiller réessayer plus tard',
      variant: 'destructive'
    })
  } finally {
    isLoading.value = false
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
            placeholder="Votre adresse email"
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

    <Button type="submit" size="form" :disabled="isLoading">
      {{ isLoading ? 'Inscription en cours...' : "S'inscrire" }}
    </Button>
  </form>
</template>

<style scoped></style>
