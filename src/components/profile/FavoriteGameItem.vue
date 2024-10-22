<script setup lang="ts">
import { defineProps } from 'vue';

import {
  Check, ChevronsUpDown,
  Edit2
} from 'lucide-vue-next'

const props = defineProps<{
  imageUrl: string;
  gameName: string;
  level: string;
  description: string;
}>();

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogScrollContent, DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Textarea } from '@/components/ui/textarea'

const niveaux = [
  { value: 'debutant', label: 'Débutant' },
  { value: 'intermediaire', label: 'Intermédiaire' },
  { value: 'avance', label: 'Avancé' },
]

import { ref } from 'vue'

const open = ref(false)
const value = ref('')
</script>

<template>
  <div class="flex justify-start items-start">
    <img
      :src="imageUrl"
      alt="game"
      class="w-1/5 h-auto object-contain border-custom-background rounded-lg"
    />
    <div class="flex flex-col justify-start space-y-2 pl-2">
      <div class="flex items-center">
        <p class="text-foreground font-bold">{{ gameName }}</p>
        <Dialog>
          <DialogTrigger as-child>
            <Button size="round">
              <Edit2 class="size-3.5"/>
            </Button>
          </DialogTrigger>
          <DialogScrollContent class="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Modifier le jeu</DialogTitle>
              <DialogDescription>
                Modifiez votre niveau, sa description ou supprimez le jeu.
              </DialogDescription>
            </DialogHeader>
            <div class="grid gap-4 py-4">
              <p class="text-foreground font-bold">{{ gameName }}</p>
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
              <Button type="submit"> Modifier </Button>
              <Button type="submit" variant="destructive"> Supprimer </Button>

            </DialogFooter>
          </DialogScrollContent>
        </Dialog>
      </div>
      <div class="flex mb-2">
        <Badge variant="outline">
          {{ level }}
        </Badge>
      </div>
      <p class="text-custom-white text-xs">{{ description }}</p>
    </div>
  </div>
</template>

<style scoped>

</style>