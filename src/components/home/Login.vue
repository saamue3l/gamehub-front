<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { loginPostSchema } from '@/types/Login.ts'
import { useForm } from 'vee-validate'
import { useRouter } from 'vue-router'
import { toTypedSchema } from '@vee-validate/zod'
import { postLogin } from '@/api/postLogin'
import { UserStore } from '@/store/userStore'
import { useToast } from '@/components/ui/toast'

const router = useRouter()
const userStore = UserStore()
const { toast } = useToast()

const validationSchema = toTypedSchema(loginPostSchema)

const { handleSubmit } = useForm({
  validationSchema
})

const onSubmit = handleSubmit(async (values) => {
  try {
    await postLogin(values)
    userStore.setUsername()
    await router.push({ name: 'Profil', params: { username: userStore.username } })
  } catch (error) {
    let message = 'Une erreur est survenue, veuillez réessayer plus tard.'

    if (error.message === 'Échec de la connexion, informations incorrectes.') {
      message = 'Identifiants incorrects. Veuillez vérifier votre email et mot de passe.'
    }
    toast({
      title: "Quelques chose n'a pas fonctionné.",
      description: message,
      variant: 'destructive'
    })
  }
})
</script>

<template>
  <form class="space-y-6" @submit="onSubmit">
    <FormField
      v-slot="{ componentField }"
      name="email"
      :validate-on-change="false"
      :validate-on-input="false"
      :validate-on-blur="false"
      :validate-on-mount="false"
      :validate-on-model-update="false"
    >
      <FormItem>
        <FormLabel>Email</FormLabel>
        <FormControl>
          <Input type="email" placeholder="Votre email" v-bind="componentField" />
        </FormControl>
      </FormItem>
    </FormField>

    <FormField
      v-slot="{ componentField }"
      name="password"
      :validate-on-change="false"
      :validate-on-input="false"
      :validate-on-blur="false"
      :validate-on-mount="false"
      :validate-on-model-update="false"
    >
      <FormItem>
        <FormLabel>Mot de passe</FormLabel>
        <FormControl>
          <Input type="password" placeholder="Votre mot de passe" v-bind="componentField" />
        </FormControl>
      </FormItem>
    </FormField>

    <Button type="submit" size="form"> Se connecter </Button>
  </form>
</template>
