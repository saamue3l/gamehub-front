<script setup lang="ts">
import { ref, defineProps, defineEmits, watch } from 'vue'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Edit2 } from 'lucide-vue-next'
import { useToast } from '@/components/ui/toast/use-toast'
import type { Availability } from '@/types/Availability'

const { toast } = useToast()

const props = defineProps<{
  availabilities: Availability[]
}>()

const emit = defineEmits<{
  'update:availabilities': [availabilities: Availability[]]
}>()

const isOpen = ref(false)
const isSaving = ref(false)

const allDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
const periodHeaders = [
  { key: 'morning', label: 'matin' },
  { key: 'afternoon', label: 'aprèm' },
  { key: 'evening', label: 'soir' },
  { key: 'night', label: 'nuit' }
]

const localAvailabilities = ref<Availability[]>([])

const initializeLocalAvailabilities = () => {
  localAvailabilities.value = allDays.map((day) => {
    const existing = props.availabilities.find((a) => a.dayOfWeek === day)
    return existing
      ? { ...existing }
      : {
          dayOfWeek: day,
          morning: false,
          afternoon: false,
          evening: false,
          night: false
        }
  })
}

const getAvailabilityForDay = (day: string, period: keyof Omit<Availability, 'dayOfWeek'>) => {
  const dayAvailability = localAvailabilities.value.find((a) => a.dayOfWeek === day)
  return dayAvailability ? dayAvailability[period] : false
}

const toggleAvailability = (day: string, period: keyof Omit<Availability, 'dayOfWeek'>) => {
  const dayIndex = localAvailabilities.value.findIndex((a) => a.dayOfWeek === day)
  if (dayIndex !== -1) {
    const newAvailabilities = [...localAvailabilities.value]
    newAvailabilities[dayIndex] = {
      ...newAvailabilities[dayIndex],
      [period]: !newAvailabilities[dayIndex][period]
    }
    localAvailabilities.value = newAvailabilities
  }
}

const saveChanges = async () => {
  isSaving.value = true
  try {
    const availabilitiesToSave = localAvailabilities.value.filter(
      (day) => day.morning || day.afternoon || day.evening || day.night
    )

    emit('update:availabilities', availabilitiesToSave)
    isOpen.value = false
  } catch (error) {
    toast({
      title: 'Erreur',
      description: 'Impossible de sauvegarder les modifications',
      variant: 'destructive'
    })
  } finally {
    isSaving.value = false
  }
}

watch(
  [() => props.availabilities, isOpen],
  ([newAvailabilities]) => {
    if (isOpen.value) {
      localAvailabilities.value = allDays.map((day) => {
        const existing = newAvailabilities.find((a) => a.dayOfWeek === day)
        return {
          dayOfWeek: day,
          morning: existing?.morning ?? false,
          afternoon: existing?.afternoon ?? false,
          evening: existing?.evening ?? false,
          night: existing?.night ?? false
        }
      })
    }
  },
  { immediate: true }
)
</script>

<template>
  <div class="flex items-end justify-end">
    <Dialog v-model:open="isOpen" @open="initializeLocalAvailabilities">
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

        <div class="text-xs p-2">
          <div class="grid grid-cols-[20px_repeat(4,1fr)] gap-2">
            <span></span>
            <div
              v-for="period in periodHeaders"
              :key="period.key"
              class="font-bold text-center flex justify-center items-end"
            >
              {{ period.label }}
            </div>

            <template v-for="day in allDays" :key="day">
              <div class="font-semibold text-center flex justify-end items-center">{{ day }}</div>
              <template v-for="period in periodHeaders" :key="`${day}-${period.key}`">
                <div
                  class="rounded-full cursor-pointer transition-colors"
                  :class="[
                    getAvailabilityForDay(day, period.key)
                      ? 'bg-primary hover:bg-primary/90'
                      : 'border hover:border-primary'
                  ]"
                  @click="toggleAvailability(day, period.key)"
                ></div>
              </template>
            </template>
          </div>
        </div>

        <DialogFooter>
          <Button type="submit" @click="saveChanges" :loading="isSaving"> Enregistrer </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
