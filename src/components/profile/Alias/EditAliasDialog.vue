<script setup lang="ts">
import { Input } from '@/components/ui/input'
import { Edit2 } from 'lucide-vue-next'
import { Check } from 'lucide-vue-next'
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogScrollContent,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ref, onMounted, watch, computed } from 'vue'
import { useUserAliasStore } from '@/store/userAliasStore'
import { usePlatformStore } from '@/store/platformStore'
import type { Username, UsernameUpdate } from '@/types/Username'
import { storeToRefs } from 'pinia'
import { useToast } from '@/components/ui/toast'
const { toast } = useToast()
import { useActionHandler } from '@/services/actionHandler'

const platformStore = usePlatformStore()
const { platforms } = storeToRefs(platformStore)

const firstHalfPlatforms = computed(() => {
  const halfLength = Math.ceil(platforms.value.length / 2)
  return platforms.value.slice(0, halfLength)
})

const secondHalfPlatforms = computed(() => {
  const halfLength = Math.ceil(platforms.value.length / 2)
  return platforms.value.slice(halfLength)
})

const props = defineProps<{
  initialAlias: Username[]
}>()

const userAliasStore = useUserAliasStore()
const formData = ref<Record<number, string>>({})

const updateFormData = () => {
  platforms.value.forEach((platform) => {
    formData.value[platform.id] = ''
  })

  if (props.initialAlias) {
    props.initialAlias.forEach((alias) => {
      if (alias.platform && alias.platform.id) {
        formData.value[alias.platform.id] = alias.username
      }
    })
  }
}

onMounted(async () => {
  if (platforms.value.length === 0) {
    await platformStore.fetchPlatforms()
  }
  updateFormData()
})

watch(
  () => props.initialAlias,
  () => {
    updateFormData()
  },
  { deep: true }
)

const isOpen = ref(false)
const isUpdating = ref(false)

const saveAliases = async () => {
  try {
    isUpdating.value = true

    const { handleActionResponse } = useActionHandler()

    const updates: UsernameUpdate[] = Object.entries(formData.value)
      .filter(([_, username]) => username.trim())
      .map(([platformId, username]) => ({
        platformId: Number(platformId),
        username: username.trim()
      }))

    const response = await userAliasStore.updateUserAlias(updates)

    await handleActionResponse(response, {
      title: 'Succès',
      description: `Alias modifié avec succès`
    })
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des alias:', error)
  } finally {
    isUpdating.value = false
    isOpen.value = false
  }
}
</script>

<template>
  <Dialog v-model:open="isOpen">
    <DialogTrigger as-child>
      <Button size="round" class="ml-0 p-2 mb-2 mr-2">
        <Edit2 class="size-4" />
      </Button>
    </DialogTrigger>
    <DialogScrollContent class="sm:max-w-[625px]">
      <DialogHeader>
        <DialogTitle>Modifier vos alias</DialogTitle>
        <DialogDescription>
          Ajoutez ou modifiez vos pseudos pour différentes plateformes et laissez vide pour
          supprimer. Appuyez sur "Valider" pour enregistrer les modifications.
        </DialogDescription>
      </DialogHeader>

      <div v-if="platformStore.isLoading" class="py-4 text-center">
        <span>Chargement des plateformes...</span>
      </div>

      <div v-else-if="platformStore.error" class="py-4 text-center text-red-500">
        {{ platformStore.error }}
      </div>

      <div v-else class="grid grid-cols-2 gap-4 py-4">
        <div class="space-y-4">
          <div
            v-for="platform in firstHalfPlatforms"
            :key="platform.id"
            class="flex items-center gap-4"
          >
            <img :src="platform.logoUrl" :alt="platform.name" class="w-6 h-6 object-contain" />

            <div class="relative flex-1">
              <Input
                v-model="formData[platform.id]"
                :placeholder="'Pseudo ' + platform.name"
                class="w-full"
              />
              <span
                v-if="formData[platform.id]?.trim()"
                class="absolute right-2 top-1/2 -translate-y-1/2"
              >
                <Check class="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>

        <div class="space-y-4">
          <div
            v-for="platform in secondHalfPlatforms"
            :key="platform.id"
            class="flex items-center gap-4"
          >
            <img :src="platform.logoUrl" :alt="platform.name" class="w-6 h-6 object-contain" />

            <div class="relative flex-1">
              <Input
                v-model="formData[platform.id]"
                :placeholder="'Pseudo ' + platform.name"
                class="w-full"
              />
              <span
                v-if="formData[platform.id]?.trim()"
                class="absolute right-2 top-1/2 -translate-y-1/2"
              >
                <Check class="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button type="submit" @click="saveAliases" :disabled="isUpdating">
          {{ isUpdating ? 'Validation en cours...' : 'Valider' }}
        </Button>
      </DialogFooter>
    </DialogScrollContent>
  </Dialog>
</template>
