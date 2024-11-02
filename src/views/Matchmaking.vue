<script setup lang="ts">
import BasePage from '@/components/layout/BasePage.vue';
import SearchGame from '@/components/layout/games/SearchGame.vue';
import { ref, onMounted } from 'vue';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Dialog, DialogTrigger, DialogTitle, DialogDescription, DialogFooter, DialogHeader, DialogScrollContent } from '@/components/ui/dialog';
import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Check, ChevronsUpDown } from 'lucide-vue-next';
import { cn, httpBackend } from '@/lib/utils'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'



const niveaux = [
  { value: '1', label: 'Débutant' },
  { value: '2', label: 'Intermédiaire' },
  { value: '3', label: 'Avancé' },
]

const isDialogOpen = ref(false);
const selectedGames = ref([]);
const selectedGame = ref<any>(null);
const selectedLevel = ref('');
const open = ref(false);
const gameError = ref(false);
const levelError = ref(false);
const isLoading = ref(false);
const errorMessage = ref<string | null>(null);
const matchResults = ref<any[]>([]);

function handleSelectGame(game: any) {
  selectedGame.value = game;
  gameError.value = !game;
}

function confirmAddGame() {
  // Validate game and level selection
  gameError.value = !selectedGame.value;
  levelError.value = !selectedLevel.value;

  if (selectedGame.value && selectedLevel.value) {
    addGame();
    isDialogOpen.value = false;
    selectedGame.value = null;
    selectedLevel.value = '';
  }
}

function addGame() {
  if (selectedGame.value && selectedLevel.value) {
    const gameToAdd = {
      ...selectedGame.value,
      level: selectedLevel.value,
      levelLabel: niveaux.find(n => n.value === selectedLevel.value)?.label || '',
    };
    selectedGames.value.push(gameToAdd);
    sendGamesToApi();
  }
}

function removeGame(index: number) {
  selectedGames.value.splice(index, 1);
  sendGamesToApi();
}

function selectLevel(level: string) {
  selectedLevel.value = level;
  levelError.value = false;
  open.value = false;
}

function closeDialog() {
  isDialogOpen.value = false;
  levelError.value = false;
  gameError.value = false;
  selectedGame.value = null;
  selectedLevel.value = '';
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
    console.log(gamesData);
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
          class="relative border border-white rounded-full mt-2 flex flex-row items-center mr-2"
          style="padding: 0.25rem; font-size: 0.75rem;"
        >
          <button
            @click="removeGame(index)"
            class="relative text-white font-bold mx-1 enlarge-clickable-area"
            style="font-size: 0.75rem; line-height: 1rem;"
          >
            &times;
          </button>
          <div class="text-white font-bold mr-2">{{ game.name }}</div>
          <div class="text-gray-400 italic mr-1">{{ game.levelLabel }}</div>
        </div>

        <!-- Bouton Ajouter -->
        <Dialog v-model:open="isDialogOpen" @close="closeDialog">
          <DialogTrigger as-child>
            <div
              class="relative border border-white rounded-full p-2 mt-2 flex flex-row items-center justify-center cursor-pointer bg-blue-600 text-white font-bold"
              style="padding: 0.25rem; font-size: 0.75rem;"
            >
              <span class="mx-1">+</span>
              <span class="mr-1">Ajouter un jeu</span>
            </div>
          </DialogTrigger>
          <DialogScrollContent class="flex flex-col gap-6">
            <DialogHeader>
              <DialogTitle>Ajouter un jeu</DialogTitle>
              <DialogDescription>Choisissez un jeu et votre niveau.</DialogDescription>
            </DialogHeader>

            <!-- Recherche du jeu -->
            <FormField name="gameId">
              <FormItem>
                <FormLabel>Jeu de l'évènement</FormLabel>
                <FormControl>
                  <SearchGame @select-game="handleSelectGame"></SearchGame>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <!-- Message d'erreur jeu -->
            <p v-if="gameError" class="text-red-500 text-sm">Veuillez sélectionner un jeu.</p>

            <!-- Sélection du niveau -->
            <Popover v-model:open="open">
              <PopoverTrigger as-child>
                <Button
                  variant="outline"
                  role="combobox"
                  :aria-expanded="open"
                  class="w-[200px] flex items-center justify-between"
                >
                  {{
                    selectedLevel
                      ? niveaux.find((niveau) => niveau.value === selectedLevel)?.label
                      : "Votre niveau..."
                  }}
                  <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent class="w-[200px] p-0">
                <Command>
                  <CommandList>
                    <CommandGroup>
                      <CommandItem
                        v-for="niveau in niveaux"
                        :key="niveau.value"
                        :value="niveau.value"
                        @click="() => selectLevel(niveau.value)"
                        class="cursor-pointer"
                        :class="{
                          'hover:bg-gray-300': true
                        }"
                      >
                        {{ niveau.label }}
                        <Check
                          :class="cn(
                            'ml-auto h-4 w-4',
                            selectedLevel === niveau.value ? 'opacity-100' : 'opacity-0'
                          )"
                        />
                      </CommandItem>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            <!-- Message d'erreur niveau -->
            <p v-if="levelError" class="text-red-500 text-sm">Veuillez sélectionner un niveau.</p>
            <DialogFooter>
              <Button type="button" @click="confirmAddGame">Ajouter</Button>
            </DialogFooter>
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
          <img src="@/assets/joachim.jpg" alt="Jojo" class="profile-image mx-auto mb-2" />
          <p class="username truncate">{{ result.username }}</p>
          <p>Correspondance :</p>
          <div class="progress-bar bg-gray-700 rounded-full h-2 mt-2">
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
.profile-card {
  width: 12rem; /* Adjust the width as needed */
}

.profile-image {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.username {
  font-weight: bold;
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.progress-bar {
  width: 100%;
  background-color: #2d3748; /* Dark gray background */
  border-radius: 4px;
  overflow: hidden;
  height: 0.5rem;
  margin-top: 8px;
}

.progress {
  height: 100%;
  background-color: #4299e1; /* Blue color */
}

.results-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}

.enlarge-clickable-area::before {
  content: '';
  position: absolute;
  top: -0.5rem;
  bottom: -0.5rem;
  left: -0.5rem;
  right: -0.5rem;
}
</style>