<template>
  <Dialog v-model:open="isOpen">
    <DialogTrigger as-child>
      <Button size="round">
        <Edit2 class="size-3.5" />
      </Button>
    </DialogTrigger>
    <DialogScrollContent class="sm:max-w-[425px]">
      <form @submit.prevent="handleUpdate">
        <DialogHeader>
          <DialogTitle>Modifier le jeu</DialogTitle>
          <DialogDescription>
            Modifiez votre niveau, sa description ou supprimez le jeu.
          </DialogDescription>
        </DialogHeader>
        <div class="grid gap-4 py-4">
          <div class="flex gap-4 items-center">
            <img
              :src="imageUrl"
              :alt="gameName"
              class="w-1/5 h-auto object-contain border-custom-background rounded-lg"
            />
            <span>{{ gameName }}</span>
          </div>
          <SkillsCombobox v-model="selectedSkill" :initial-skill-id="props.skillId" />
          <Textarea
            v-model="description"
            placeholder="Décrivez votre niveau ou partagez tout autre détail comme la plateforme sur laquelle vous jouez."
          />
        </div>
        <DialogFooter class="flex gap-2">
          <Button type="submit" :disabled="!isFormValid || isUpdating || isDeleting">
            {{ isUpdating ? 'Modification en cours...' : 'Modifier' }}
          </Button>
          <Button
            type="button"
            variant="destructive"
            @click="handleDelete"
            :disabled="isUpdating || isDeleting"
          >
            {{ isDeleting ? 'Suppression en cours...' : 'Supprimer' }}
          </Button>
        </DialogFooter>
      </form>
    </DialogScrollContent>
  </Dialog>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Edit2 } from 'lucide-vue-next'
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogScrollContent,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import SkillsCombobox from '@/components/layout/skills/SkillsCombobox.vue'
import { computed, ref } from 'vue'
import { useToast } from '@/components/ui/toast'
import { useFavoriteGamesStore } from '@/store/favoriteGamesStore'
import type { SkillType } from '@/types/SkillType'
import type { FavoriteGameUpdate } from '@/types/FavoriteGame'

const { toast } = useToast()

const props = defineProps<{
  favoriteGameId: number
  gameName: string
  imageUrl: string
  skillId: number
  description: string
}>()

const favoriteGamesStore = useFavoriteGamesStore()

const isOpen = ref(false)
const isUpdating = ref(false)
const isDeleting = ref(false)

const selectedSkill = ref<SkillType | null>(null)
const description = ref(props.description)

const isFormValid = computed(() => {
  return selectedSkill.value && description.value.trim().length > 0
})

const handleUpdate = async (event: Event) => {
  event.preventDefault()
  if (!isFormValid.value || isUpdating.value) return

  try {
    isUpdating.value = true

    const updates: FavoriteGameUpdate = {
      id: props.favoriteGameId,
      description: description.value,
      skill: selectedSkill.value
    }

    await favoriteGamesStore.updateFavoriteGame(updates)

    selectedSkill.value = null
    toast({
      title: 'Succès',
      description: 'Le jeu a été modifié avec succès'
    })
  } catch (error) {
    console.error('Erreur lors de la modification:', error)
    toast({
      variant: 'destructive',
      title: 'Erreur',
      description: 'Une erreur est survenue lors de la modification'
    })
  } finally {
    isUpdating.value = false
    isOpen.value = false
  }
}

const handleDelete = async () => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer ce jeu ?')) return

  try {
    isDeleting.value = true

    console.log('favoriteGameId', props.favoriteGameId)

    await favoriteGamesStore.deleteFavoriteGame(props.favoriteGameId)

    toast({
      title: 'Succès',
      description: 'Le jeu a été supprimé avec succès'
    })
  } catch (error) {
    console.error('Erreur lors de la suppression:', error)
    toast({
      variant: 'destructive',
      title: 'Erreur',
      description: 'Une erreur est survenue lors de la suppression'
    })
  } finally {
    isDeleting.value = false
    isOpen.value = false
  }
}
</script>
