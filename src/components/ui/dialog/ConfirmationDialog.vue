<script setup lang="ts">
import Dialog from '@/components/ui/dialog/Dialog.vue'
import DialogTrigger from '@/components/ui/dialog/DialogTrigger.vue'
import { Button, type ButtonVariants } from '@/components/ui/button'
import DialogContent from '@/components/ui/dialog/DialogContent.vue'
import DialogHeader from '@/components/ui/dialog/DialogHeader.vue'
import DialogTitle from '@/components/ui/dialog/DialogTitle.vue'
import DialogScrollContent from '@/components/ui/dialog/DialogScrollContent.vue'
import DialogDescription from '@/components/ui/dialog/DialogDescription.vue'
import DialogFooter from '@/components/ui/dialog/DialogFooter.vue'
import DialogClose from '@/components/ui/dialog/DialogClose.vue'
import { ref } from 'vue'
import LoadingSpinner from '@/components/ui/feedback/spinner/LoadingSpinner.vue'

const isOpened = ref(false)

withDefaults(
  defineProps<{
    title: string
    message: string
    onConfirm: () => void
    onCancel: () => void
    isLoading: boolean
    confirmButtonText: string
    confirmButtonVariant: ButtonVariants['variant']
  }>(),
  {
    onCancel: () => {},
    isLoading: false,
    confirmButtonText: 'Confirmer',
    confirmButtonVariant: 'secondary'
  }
)
</script>

<template>
  <Dialog v-model:open="isOpened" @abort="onCancel">
    <DialogTrigger>
      <slot>
        <Button variant="default">Ouvrir le dialogue</Button>
      </slot>
    </DialogTrigger>
    <DialogScrollContent>
      <DialogHeader>
        <DialogTitle>{{ title }}</DialogTitle>
      </DialogHeader>
      <DialogDescription>
        {{ message }}
      </DialogDescription>
      <DialogFooter class="w-full flex flex-row justify-between flex-wrap">
        <Button
          variant="secondary"
          @click="
            async () => {
              await onCancel()
              isOpened = false
            }
          "
          :disabled="isLoading"
        >
          Annuler
          <LoadingSpinner v-if="isLoading" class="ml-2" />
        </Button>
        <Button
          :variant="confirmButtonVariant"
          @click="
            async () => {
              await onConfirm()
              isOpened = false
            }
          "
          :disabled="isLoading"
          >{{ confirmButtonText }}
          <LoadingSpinner v-if="isLoading" class="ml-2" />
        </Button>
      </DialogFooter>
    </DialogScrollContent>
  </Dialog>
</template>

<style scoped></style>
