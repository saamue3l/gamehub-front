<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/toast'

import { toTypedSchema } from '@vee-validate/zod'
import { Form, useForm } from 'vee-validate'
import { h } from 'vue'
import * as z from 'zod'

const formSchema = toTypedSchema(z.object({
  email: z.string().email('Adresse email invalide').min(6),
  username: z.string().min(2).max(50),
  password: z.string().min(6),
  passwordConfirm: z.string().min(6)
}));

const { handleSubmit, validate } = useForm({
  validationSchema: formSchema,
});

const onSubmit = handleSubmit(async (values) => {
  // Effectuer la validation lors de la soumission
  const isValid = await validate();
  if (isValid) {
    toast({
      title: 'You submitted the following values:',
      description: h('pre', { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' }, h('code', { class: 'text-white' }, JSON.stringify(values, null, 2))),
    });
  }
});
</script>

<template>
  <form class="space-y-6" @submit="onSubmit">

    <FormField v-slot="{ componentField }" name="email">
      <FormItem>
        <FormLabel>Adresse email</FormLabel>
        <FormControl>
          <Input type="text" placeholder="Votre addresse email" v-bind="componentField" :validate-on-blur="false" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="username">
      <FormItem>
        <FormLabel>Pseudo</FormLabel>
        <FormControl>
          <Input type="text" placeholder="Votre nom d'utilisateur" v-bind="componentField" :validate-on-blur="false" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="password">
      <FormItem>
        <FormLabel>Mot de passe</FormLabel>
        <FormControl>
          <Input type="password" placeholder="Votre mot de passe" v-bind="componentField" :validate-on-blur="false" />
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

    <Button type="submit" size="form">
      S'inscrire
    </Button>
  </form>
</template>

<style scoped>

</style>
