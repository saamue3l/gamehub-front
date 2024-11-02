<template>
  <TitleContainer title="Disponibilités">
    <div v-if="isLoading" class="w-full flex justify-center">
      <LoadingSpinner size="xl"></LoadingSpinner>
    </div>

    <div v-else-if="error" class="text-red-500 text-center">
      <p>{{ error }}</p>
    </div>

    <div v-else-if="!availableDays.length" class="flex flex-wrap p-2">
      <p>Aucune disponibilité renseignée</p>
      <EditAvailabilityDialog
        v-if="profileStore.isOwnProfile && !isLoading"
        :availabilities="availabilities"
        @update:availabilities="handleAvailabilityUpdate"
      />
    </div>

    <template v-else>
      <div class="text-xs p-2 pl-0">
        <div
          class="grid gap-2"
          :class="
            profileStore.isOwnProfile
              ? 'grid-cols-[40px_repeat(4,1fr)]'
              : 'grid-cols-[30px_repeat(4,1fr)]'
          "
        >
          <EditAvailabilityDialog
            v-if="profileStore.isOwnProfile && !isLoading"
            :availabilities="availabilities"
            @update:availabilities="handleAvailabilityUpdate"
          />
          <span v-else></span>

          <div
            v-for="period in periodHeaders"
            :key="period.key"
            class="font-bold text-center flex justify-center items-end"
          >
            {{ period.label }}
          </div>

          <template v-for="day in availableDays" :key="day.dayOfWeek">
            <div class="font-semibold text-center flex justify-end">{{ day.dayOfWeek }}</div>
            <template v-for="period in periodHeaders" :key="`${day.dayOfWeek}-${period.key}`">
              <div class="rounded-full" :class="[day[period.key] ? 'bg-primary' : 'border']"></div>
            </template>
          </template>
        </div>
      </div>
    </template>
  </TitleContainer>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { useProfileStore } from '@/store/profileStore'
import TitleContainer from '@/components/profile/TitleContainer.vue'
import EditAvailabilityDialog from '@/components/profile/Availability/EditAvailabilityDialog.vue'
import { httpBackend } from '@/lib/utils'
import LoadingSpinner from '@/components/ui/feedback/spinner/LoadingSpinner.vue'
import type { Availability } from '@/types/Availability'

const route = useRoute()
const profileStore = useProfileStore()

const periodHeaders = [
  { key: 'morning', label: 'matin' },
  { key: 'afternoon', label: 'aprèm' },
  { key: 'evening', label: 'soir' },
  { key: 'night', label: 'nuit' }
]

const availabilities = ref<Availability[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)

const availableDays = computed(() => {
  return availabilities.value
    .filter((day) => day.morning || day.afternoon || day.evening || day.night)
    .sort((a, b) => {
      const dayOrder = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
      return dayOrder.indexOf(a.dayOfWeek) - dayOrder.indexOf(b.dayOfWeek)
    })
})

const fetchUserAvailability = async (username: string) => {
  try {
    isLoading.value = true
    error.value = null
    availabilities.value = await httpBackend<Availability[]>(
      `/api/profile/${username}/userAvailability`
    )
  } catch (err) {
    error.value = 'Erreur lors de la récupération des disponibilités'
    console.error('Error fetching availability:', err)
  } finally {
    isLoading.value = false
  }
}

watchEffect(() => {
  if (route.params.username) {
    fetchUserAvailability(route.params.username as string)
  }
})

const handleAvailabilityUpdate = async (newAvailabilities: Availability[]) => {
  try {
    await httpBackend<void>('/api/profile/updateAvailability', 'PUT', newAvailabilities)

    availabilities.value = newAvailabilities
  } catch (error) {
    error.value = 'Erreur lors de la mise à jour des disponibilités'
    console.error('Error fetching availability:', err)
  }
}
</script>
