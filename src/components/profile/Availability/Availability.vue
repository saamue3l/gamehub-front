<template>
  <TitleContainer title="Disponibilités">
    <div class="text-xs p-2 pl-0">
      <div class="grid grid-cols-5 gap-2">
        <div class="flex items-end justify-end">
          <Dialog>
            <DialogTrigger as-child>
              <Button size="round" class="p-2">
                <Edit2 class="size-4" />
              </Button>
            </DialogTrigger>
            <DialogContent class="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Disponibilités</DialogTitle>
                <DialogDescription>
                  Choisissez les plages horaires pour chaque jour de la semaine.
                </DialogDescription>
              </DialogHeader>
              <div class="text-xs p-2 pr-12">
                <div class="grid grid-cols-5 gap-2">
                  <div class="flex items-end justify-end"></div>
                  <div v-for="period in periods" :key="period" class="font-bold text-center flex justify-center items-end">
                    {{ period }}
                  </div>
                  <template v-for="day in days" :key="day">
                    <div class="font-semibold text-center flex justify-end">{{ day }}</div>
                    <template v-for="period in periods" :key="`${day}-${period}`">
                      <div
                        :id="`${day}-${period}`"
                        @click="toggleAvailability(`${day}-${period}`)"
                        :class="[
                          'rounded-full cursor-pointer',
                          availability[`${day}-${period}`] ? 'bg-primary' : 'border'
                        ]"
                      ></div>
                    </template>
                  </template>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" @click="saveChanges">
                  Enregistrer les modifications
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <div v-for="period in periods" :key="period" class="font-bold text-center flex justify-center items-end">
          {{ period }}
        </div>

        <template v-for="day in days" :key="day">
          <template v-if="hasDayAvailability(day)">
            <div class="font-semibold text-center flex justify-end">{{ day }}</div>
            <template v-for="period in periods" :key="`${day}-${period}`">
              <div
                :class="[
                  'rounded-full',
                  availability[`${day}-${period}`] ? 'bg-primary' : 'border'
                ]"
              ></div>
            </template>
          </template>
        </template>
      </div>
    </div>
  </TitleContainer>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import TitleContainer from '@/components/profile/TitleContainer.vue'
import { Button } from '@/components/ui/button'
import { Edit2 } from 'lucide-vue-next'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

const days = ref(['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'])
const periods = ref(['matin', 'aprèm', 'soir', 'nuit'])

const availability = reactive<Record<string, boolean>>({})

const toggleAvailability = (id: string) => {
  availability[id] = !availability[id]
}

const hasDayAvailability = (day: string) => {
  return periods.value.some(period => availability[`${day}-${period}`])
}

const saveChanges = () => {
  console.log('Saving availability:', availability)
  // Ici, vous pouvez ajouter la logique pour sauvegarder les modifications dans votre backend
}

// Initialiser l'état de disponibilité
days.value.forEach(day => {
  periods.value.forEach(period => {
    availability[`${day}-${period}`] = false
  })
})
</script>