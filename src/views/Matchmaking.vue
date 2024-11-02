<script setup lang="ts">
import BasePage from '@/components/layout/BasePage.vue';
import SearchGame from '@/components/layout/games/SearchGame.vue';
import SkillsCombobox from '@/components/layout/skills/SkillsCombobox.vue';
import { ref, watch } from 'vue';
import { Dialog, DialogTrigger, DialogTitle, DialogDescription, DialogFooter, DialogHeader, DialogScrollContent } from '@/components/ui/dialog';
import { httpBackend } from '@/lib/utils'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'

const isDialogOpen = ref(false);
const selectedGames = ref([]);
const selectedGame = ref<any>(null);
const selectedLevel = ref(null);
const gameError = ref(false);
const levelError = ref(false);
const isLoading = ref(false);
const errorMessage = ref<string | null>(null);
const matchResults = ref<any[]>([]);

function handleSelectGame(game: any) {
  selectedGame.value = game;
  gameError.value = false;
}

function handleSelectLevel(level: any) {
  selectedLevel.value = level;
  levelError.value = false;
}

function handleSubmit() {
  // Validate game and level selection
  gameError.value = !selectedGame.value;
  levelError.value = !selectedLevel.value;

  if (selectedGame.value && selectedLevel.value) {
    addGame();
    isDialogOpen.value = false;
    resetDialog();
  }
}

function addGame() {
  if (selectedGame.value && selectedLevel.value) {

    if (isGameAlreadyAdded(selectedGame.value, selectedLevel.value)) {
      errorMessage.value = "Ce jeu avec ce niveau est déjà ajouté.";
      return;
    }

    const gameToAdd = {
      ...selectedGame.value,
      level: selectedLevel.value.id,
      levelLabel: selectedLevel.value.label,
    };
    selectedGames.value.push(gameToAdd);
    sendGamesToApi();
  }
}

function isGameAlreadyAdded(game: any, level: any) {
  return selectedGames.value.some(
    (selectedGame) => selectedGame.id === game.id && selectedGame.level === level.id
  );
}

function removeGame(index: number) {
  selectedGames.value.splice(index, 1);
  sendGamesToApi();
}

function closeDialog() {
  isDialogOpen.value = false;
  resetDialog();
}

function resetDialog() {
  selectedGame.value = null;
  selectedLevel.value = null;
  gameError.value = false;
  levelError.value = false;
}

async function sendGamesToApi() {
  if (selectedGames.value.length === 0) {
    matchResults.value = [];
    return;
  }
  try {
    isLoading.value = true;
    errorMessage.value = null;
    const gamesData = selectedGames.value.map(game => ({
      gameId: game.id,
      skillTypeId: game.level,
    }));
    const response = await httpBackend('/api/matchmaking', 'POST', gamesData);

    if (response.status !== 'success') {
      errorMessage.value = "Une erreur s'est produite lors de l'envoi des jeux.";
    } else {
      matchResults.value = response.matchResult;
    }
  } catch (error) {
    errorMessage.value = "Nous n'avons pas réussi à envoyer les jeux. Veuillez réessayer plus tard.";
  } finally {
    isLoading.value = false;
  }
}

watch(isDialogOpen, (newVal) => {
  if (!newVal) {
    resetDialog();
  }
});
</script>

<template>
  <BasePage title="Matchmaking">
    <header class="w-full flex justify-between flex-wrap gap-3 max-w-full">
      <h2 class="text-left">Sélectionnez vos jeux préférés et indiquez votre niveau pour chaque jeu. Plus vous ajoutez de jeux, plus vos chances de trouver des correspondances adéquates augmentent.</h2>
      <!-- Jeux sélectionnés -->
      <div class="flex flex-row flex-wrap justify-start">
        <!-- Liste des jeux sélectionnés -->
        <div
          v-for="(game, index) in selectedGames"
          :key="index"
          class="relative border border-white rounded-full mt-2 flex flex-row items-center mr-2 p-1 text-sm"
          style="padding: 0.25rem; font-size: 0.75rem;">
          <button
            @click="removeGame(index)"
            class="relative text-white font-bold mx-1 enlarge-clickable-area text-sm leading-none"
            style="font-size: 0.75rem; line-height: 1rem;">
            &times;
          </button>
          <div class="text-white font-bold mr-2">{{ game.name }}</div>
          <div class="text-gray-400 italic mr-1">{{ game.levelLabel }}</div>
        </div>

        <!-- Bouton Ajouter -->
        <Dialog v-model:open="isDialogOpen" @close="closeDialog">
          <DialogTrigger as-child>
            <div
              class="relative border border-white rounded-full p-2 mt-2 flex flex-row items-center justify-center cursor-pointer bg-blue-600 text-white font-bold text-sm"
              style="padding: 0.25rem; font-size: 0.75rem;"
            >
              <span class="mx-1">+</span>
              <span class="mr-1">Ajouter un jeu</span>
            </div>
          </DialogTrigger>
          <DialogScrollContent class="flex flex-col gap-6">
            <form @submit.prevent="handleSubmit">
              <DialogHeader>
                <DialogTitle>Ajouter un jeu</DialogTitle>
                <DialogDescription>Choisissez un jeu et votre niveau.</DialogDescription>
              </DialogHeader>

              <!-- Espace supplémentaire -->
              <div class="mt-4"></div>

              <!-- Recherche du jeu -->
              <FormField name="gameId">
                <FormItem>
                  <FormLabel :class="{ 'text-red-500': gameError }">Veuillez sélectionner un jeu.</FormLabel>
                  <FormControl>
                    <SearchGame @select-game="handleSelectGame"></SearchGame>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <!-- Sélection du niveau -->
              <FormField name="levelId">
                <FormItem class="flex flex-col">
                  <FormLabel :class="{ 'text-red-500': levelError }">Veuillez sélectionner votre niveau.</FormLabel>
                  <FormControl class="mt-2">
                    <SkillsCombobox v-model="selectedLevel" @update:modelValue="handleSelectLevel" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <DialogFooter>
                <Button type="submit">Ajouter</Button>
              </DialogFooter>
            </form>
          </DialogScrollContent>
        </Dialog>
      </div>
    </header>
    <!-- Encadré de Résultats -->
    <div class="border border-custom-white rounded-lg p-4">
      <p>Résultats ici...</p>
      <div class="results-container flex flex-wrap justify-start">
        <router-link
          v-for="result in matchResults"
          :key="result.userId"
          :to="`/profil/${result.username}`"
          class="profile-card border border-gray-300 rounded-lg p-4 m-2 text-center w-48"
        >
          <img src="@/assets/joachim.jpg" alt="Jojo" class="profile-image mx-auto mb-2 rounded-full w-12 h-12" />
          <p class="username truncate font-bold mb-2">{{ result.username }}</p>
          <p>Correspondance :</p>
          <div class="progress-bar bg-gray-700 rounded-full h-2 mt-2 w-full">
            <div
              class="progress bg-blue-500 h-full rounded-full"
              :style="{ width: (result.gamesQtyFound / selectedGames.length) * 100 + '%' }"
            ></div>
          </div>
        </router-link>
      </div>
    </div>
  </BasePage>
</template>

<style scoped>
.enlarge-clickable-area::before {
  content: '';
  position: absolute;
  top: -0.5rem;
  bottom: -0.5rem;
  left: -0.5rem;
  right: -0.5rem;
}
</style>