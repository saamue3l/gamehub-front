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
    console.log("Appel vers l'API");
    sendGamesToApi();
  }
}

function removeGame(index: number) {
  selectedGames.value.splice(index, 1);
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
  console.log('selectedGame:', selectedGame.value);
  console.log('selectedLevel:', selectedLevel.value);
}

async function sendGamesToApi() {
  if (selectedGames.value.length === 0) {
    return;
  }
  try {
    isLoading.value = true;
    errorMessage.value = null;
    console.log("Essai de l'envoi...");
    console.log(selectedGames);
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
      console.log('API Response:', response.matchResult);
    }
  } catch (error) {
    console.log("ERROR CATCH...");
    errorMessage.value = "Nous n'avons pas réussi à envoyer les jeux. Veuillez réessayer plus tard.";
    console.error('Error sending games to API:', error);
  } finally {
    isLoading.value = false;
  }
}

onMounted(sendGamesToApi);
</script>

<template>
  <BasePage title="Filtres">
    <div class="container mx-auto">
      <!-- Jeux sélectionnés -->
      <div class="border border-custom-white rounded-lg p-4 mb-4">
        <div class="flex flex-row flex-wrap justify-start pl-2">
          <!-- Liste des jeux sélectionnés -->
          <div
            v-for="(game, index) in selectedGames"
            :key="index"
            class="relative border border-gray-300 rounded-lg p-2 mt-4 flex flex-col items-center w-24 h-32 mx-2"
          >
            <img :src="game.coverUrl" :alt="game.name" class="w-full h-full object-contain" />
            <div class="flex flex-col items-center mt-2">
              <p class="text-custom-white text-xs font-light py-0.5 px-2 bg-custom-secondary rounded-3xl inline-block">
                {{ game.levelLabel }}
              </p>
            </div>
            <Button
              @click="removeGame(index)"
              variant="destructive"
              class="absolute -top-2 -right-2 text-lg w-6 h-6 flex justify-center items-center rounded-full p-0 leading-none"
            >
              &times;
            </Button>
          </div>

          <!-- Bouton Ajouter -->
          <Dialog v-model:open="isDialogOpen" @close="closeDialog" >
            <DialogTrigger as-child>
              <div
                class="relative border border-gray-300 rounded-lg p-2 mt-4 flex flex-col items-center w-24 h-32 mx-2 justify-center cursor-pointer text-gray-500 text-2xl"
              >
                +
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
      </div>
      <!-- Encadré de Résultats -->
      <div class="border border-custom-white rounded-lg p-4">
        <p>Résultats ici...</p>
        <ul>
          <li v-for="result in matchResults" :key="result.userId">
            {{ result.username }}
          </li>
        </ul>
      </div>
    </div>
  </BasePage>
</template>