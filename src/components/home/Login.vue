<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import * as z from 'zod'

const formSchema = toTypedSchema(
  z.object({
    email: z.string().email('Email invalide'),
    password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères')
  })
)

const { handleSubmit } = useForm({
  validationSchema: formSchema
})

async function getCsrfCookie() {
  await fetch('http://127.0.0.1:8000/sanctum/csrf-cookie', {
    method: 'GET',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    }
  })
}

const onSubmit = handleSubmit(async (values) => {
  try {
    await getCsrfCookie()

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify(values),
      credentials: 'include'
    }

    const response = await fetch('http://127.0.0.1:8000/api/login', requestOptions)

    if (!response.ok) {
      const errorResponse = await response.json()
      throw new Error(errorResponse.message || 'Échec de la connexion.')
    }

    const data = await response.json()

    sessionStorage.setItem('token', data.token)
    sessionStorage.setItem('username', data.user.username)
    window.location.href = '/'
  } catch (error) {
    //toast d'erreur
  }
})
</script>

<template>
  <form class="space-y-6" @submit="onSubmit">
    <FormField v-slot="{ componentField }" name="email">
      <FormItem>
        <FormLabel>Email</FormLabel>
        <FormControl>
          <Input type="email" placeholder="Votre email" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="password">
      <FormItem>
        <FormLabel>Mot de passe</FormLabel>
        <FormControl>
          <Input type="password" placeholder="Votre mot de passe" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <Button type="submit" size="form"> Se connecter </Button>
  </form>
</template>
