<template>
  <TitleContainer title="ALIAS">
    <div class="flex flex-wrap pt-2 pl-2">
      <template v-for="alias in aliases" :key="alias.platform">
        <AliasItem
          v-if="alias.username"
          :icon-url="alias.iconUrl"
          :username="alias.username"
          :copyable="true"
        />
      </template>

      <Dialog>
        <DialogTrigger as-child>
          <Button size="round" class="ml-0 p-2 mb-2 mr-2">
            <Edit2 class="size-4" />
          </Button>
        </DialogTrigger>
        <DialogScrollContent class="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Modifier vos alias</DialogTitle>
            <DialogDescription>
              Ajoutez ou modifiez vos pseudos pour différentes plateformes.
            </DialogDescription>
          </DialogHeader>
          <div class="grid gap-4 py-4">
            <div v-for="platform in selectedPlatforms" :key="platform.platform" class="flex items-center space-x-2 mb-4">
              <div @click="togglePlatform(platform)" class="cursor-pointer">
                <img :src="platform.iconUrl" :alt="platform.platform" class="w-10 h-10 p-1 hover:bg-secondary hover:rounded-full" />
              </div>
              <Input
                v-model="platform.username"
                type="text"
                :placeholder="'Entrez votre pseudo ' + platform.platform"
                class="flex-1 px-3 py-2 border rounded-md"
              />
            </div>
            <Separator v-if="availablePlatforms.length > 0" class="my-5" label="Cliquez pour ajouter" />
            <div v-if="availablePlatforms.length > 0" class="flex flex-wrap gap-2 pt-2 pl-2">
              <template v-for="platform in availablePlatforms" :key="platform.platform">
                <div @click="togglePlatform(platform)" class="cursor-pointer">
                  <img :src="platform.iconUrl" :alt="platform.platform" class="w-10 h-10 p-1 hover:bg-secondary hover:rounded-full" />
                </div>
              </template>
            </div>
          </div>
          <DialogFooter>
            <Button @click="saveAliases" type="submit">Valider</Button>
          </DialogFooter>
        </DialogScrollContent>
      </Dialog>
    </div>
  </TitleContainer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import TitleContainer from '@/components/profile/TitleContainer.vue'
import AliasItem from '@/components/profile/AliasItem.vue'
import { Button } from '@/components/ui/button'
import { Edit2 } from 'lucide-vue-next'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogScrollContent,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'

interface Platform {
  platform: string
  iconUrl: string
  username: string | null
}

const initialPlatforms: Platform[] = [
  { platform: 'Steam', iconUrl: 'src/assets/platformIcons/steamIcon.png', username: null },
  { platform: 'Playstation', iconUrl: 'src/assets/platformIcons/playstationIcon.png', username: null },
  { platform: 'Xbox', iconUrl: 'src/assets/platformIcons/xboxIcon.png', username: null },
  { platform: 'EA', iconUrl: 'src/assets/platformIcons/eaIcon.png', username: null },
  { platform: 'Riot games', iconUrl: 'src/assets/platformIcons/riotIcon.png', username: null },
  { platform: 'Switch', iconUrl: 'src/assets/platformIcons/switchIcon.png', username: null },
  { platform: 'Ubisoft', iconUrl: 'src/assets/platformIcons/ubisoftIcon.png', username: null },
  { platform: 'Discord', iconUrl: 'src/assets/platformIcons/discordIcon.png', username: null },
  { platform: 'Battlenet', iconUrl: 'src/assets/platformIcons/battlenetIcon.png', username: null },
]

const aliases = ref(initialPlatforms)
const selectedPlatforms = ref<Platform[]>([])

const availablePlatforms = computed(() => {
  return initialPlatforms.filter(platform =>
    !selectedPlatforms.value.some(selected => selected.platform === platform.platform)
  )
})

function togglePlatform(platform: Platform) {
  const index = selectedPlatforms.value.findIndex(p => p.platform === platform.platform)
  if (index === -1) {
    selectedPlatforms.value.push({ ...platform, username: platform.username || '' })
  } else {
    selectedPlatforms.value.splice(index, 1)
  }
}

function saveAliases() {
  selectedPlatforms.value.forEach(selectedPlatform => {
    const index = aliases.value.findIndex(p => p.platform === selectedPlatform.platform)
    if (index !== -1) {
      aliases.value[index].username = selectedPlatform.username || null
    }
  })
  selectedPlatforms.value = []
}
</script>

<style scoped></style>