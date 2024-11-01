<template>
  <Dialog v-model:open="isOpen">
    <DialogTrigger as-child>
      <Button size="sm">Ajouter un jeu</Button>
    </DialogTrigger>
    <DialogScrollContent class="sm:max-w-[425px]">
      <form @submit.prevent="handleSubmit">
        <DialogHeader>
          <DialogTitle>Ajouter un jeu</DialogTitle>
          <DialogDescription>
            Choisissez le jeu, votre niveau et écrivez une description.
          </DialogDescription>
        </DialogHeader>
        <div class="grid gap-4 py-4">
          <SearchGamePopover @select-game="selectedGame = $event" :excludeFavorites="true" />
          <div v-if="selectedGame" class="flex gap-4 items-center">
            <img
              :src="selectedGame.coverUrl"
              :alt="selectedGame.name"
              class="w-1/5 h-auto object-contain border-custom-background rounded-lg"
            />
            <span>{{ selectedGame.name }}</span>
          </div>
          <SkillsCombobox v-model="selectedSkill" />
          <Textarea
            v-model="description"
            placeholder="Décrivez votre niveau ou partagez tout autre détail comme la plateforme sur laquelle vous jouez."
          />
        </div>
        <DialogFooter>
          <Button type="submit" :disabled="!isFormValid || isSubmitting">
            {{ isSubmitting ? 'Ajout en cours...' : 'Ajouter' }}
          </Button>
        </DialogFooter>
      </form>
    </DialogScrollContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Button } from '@/components/ui/button'
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
import SearchGamePopover from '@/components/layout/games/SearchGamePopover.vue'
import type { Game } from '@/types/Game'
import { useFavoriteGamesStore } from '@/store/favoriteGamesStore'
import { useToast } from '@/components/ui/toast'
import type { SkillType } from '@/types/SkillType'
import type { FavoriteGame } from '@/types/FavoriteGame'

const favoriteGamesStore = useFavoriteGamesStore()
const { toast } = useToast()

const isOpen = ref(false)
const isSubmitting = ref(false)

const selectedGame = ref<Game | null>(null)
const selectedSkill = ref<SkillType | null>(null)
const description = ref('')

const isFormValid = computed(() => {
  return selectedGame.value && selectedSkill.value && description.value.trim().length > 0
})

const handleSubmit = async () => {
  if (!isFormValid.value || isSubmitting.value) return

  try {
    isSubmitting.value = true

    const newGame: Omit<FavoriteGame, 'id'> = {
      description: description.value,
      game: {
        id: selectedGame.value.id,
        name: selectedGame.value.name,
        cover: selectedGame.value.coverUrl || null
      } as Game,
      skill: {
        id: selectedSkill.value.id,
        label: selectedSkill.value.label
      } as SkillType
    }

    await favoriteGamesStore.addFavoriteGame(newGame)

    toast({
      title: 'Succès',
      description: `${selectedGame.value?.name} a été ajouté à vos jeux favoris avec succès`
    })

    selectedSkill.value = null
    selectedGame.value = null
    description.value = ''
  } catch (error) {
    console.error("Erreur lors de l'ajout du jeu:", error)
    toast({
      variant: 'destructive',
      title: 'Erreur',
      description: "Une erreur est survenue lors de l'ajout du jeu"
    })
  } finally {
    isSubmitting.value = false
    isOpen.value = false
  }
}
</script>
