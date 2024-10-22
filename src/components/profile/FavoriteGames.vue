<template>
  <div>
    <p class="text-custom-white text-sm font-bold pb-1 pl-2 uppercase">Jeux favoris</p>
    <div class="flex-col space-y-3 border border-custom-white rounded-lg p-3">
      <FavoriteGameItem
        image-url="src/assets/lolCover.png"
        game-name="League of Legends"
        level="Débutant"
        description="Oui les rumeurs sont vrai j'ai peak Master"
      />
      <Dialog>
        <DialogTrigger as-child>
          <Button size="sm">Ajouter un jeu</Button>
        </DialogTrigger>
        <DialogScrollContent class="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Ajouter un jeu</DialogTitle>
            <DialogDescription>
              Choisissez le jeu, votre niveau et décrivez le.
            </DialogDescription>
          </DialogHeader>
          <div class="grid gap-4 py-4">
            <Command class="rounded-lg border shadow-md">
              <CommandInput placeholder="Chercher un jeu..." v-model="search" />
              <CommandList>
                <CommandEmpty v-if="!loading && hasSearched && results.length === 0">
                  No results found.
                </CommandEmpty>
                <!-- <CommandEmpty v-else-if="!loading && !hasSearched">
                  Type to start searching...
                </CommandEmpty> -->
                <CommandGroup v-else-if="results.length > 0">
                  <CommandItem v-for="item in results" :key="item.id">
                    {{ item.name }}
                  </CommandItem>
                </CommandGroup>
                <CommandEmpty v-if="loading">Searching...</CommandEmpty>
              </CommandList>
            </Command>
            <img
              src="@/assets/lolCover.png"
              alt="game"
              class="w-1/5 h-auto object-contain border-custom-background rounded-lg"
            />
            <Popover v-model:open="open">
              <PopoverTrigger as-child>
                <Button
                  variant="outline"
                  role="combobox"
                  :aria-expanded="open"
                  class="w-[200px] justify-between"
                >
                  {{ value
                  ? niveaux.find((niveau) => niveau.value === value)?.label
                  : "Votre niveau..." }}
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
                        @select="(ev) => {
                if (typeof ev.detail.value === 'string') {
                  value = ev.detail.value
                }
                open = false
              }"
                      >
                        {{ niveau.label }}
                        <Check
                          :class="cn(
                  'ml-auto h-4 w-4',
                  value === niveau.value ? 'opacity-100' : 'opacity-0',
                )"
                        />
                      </CommandItem>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <Textarea placeholder="Décrivez votre niveau ou partagez tout autre détail qui pourrait aider à mieux vous connaître." />

          </div>
          <DialogFooter>
            <Button type="submit"> Ajouter </Button>
          </DialogFooter>
        </DialogScrollContent>
      </Dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import FavoriteGameItem from '@/components/profile/FavoriteGameItem.vue'
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

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Check, ChevronsUpDown } from 'lucide-vue-next'

const niveaux = [
  { value: 'debutant', label: 'Débutant' },
  { value: 'intermediaire', label: 'Intermédiaire' },
  { value: 'avance', label: 'Avancé' },
]

import { Textarea } from '@/components/ui/textarea'
import { ref, watch } from 'vue'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import { useDebounceFn } from '@vueuse/core'
import { cn } from '@/lib/utils'

const search = ref('')
const results = ref([])
const loading = ref(false)
const open = ref(false)
const value = ref('')

const searchAPI = async (query: string) => {
  // TODO: Replace this function with your actual API call
  // This function should return an array of objects with at least 'id' and 'name' properties
  // Example: return axios.get(`/api/search?q=${query}`).then(response => response.data)
  throw new Error('API search function not implemented')
}

const performSearch = async () => {
  if (search.value.length === 0) {
    results.value = []
    return
  }

  loading.value = true
  try {
    results.value = await searchAPI(search.value)
  } catch (error) {
    console.error('Search failed:', error)
    results.value = []
  } finally {
    loading.value = false
  }
}

const debouncedSearch = useDebounceFn(performSearch, 300)

watch(search, () => {
  debouncedSearch()
})
</script>

<style scoped></style>
