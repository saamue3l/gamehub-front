<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        role="combobox"
        :aria-expanded="open"
        class="w-[200px] justify-between"
      >
        {{ selectedSkillLabel }}
        <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-[200px] p-0">
      <Command>
        <CommandList>
          <CommandGroup>
            <CommandItem
              v-for="skill in allSkills"
              :key="skill.id"
              :value="skill.id.toString()"
              @select="(ev) => handleSelect(skill)"
            >
              {{ skill.label }}
              <Check
                :class="cn('ml-auto h-4 w-4', value?.id === skill.id ? 'opacity-100' : 'opacity-0')"
              />
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>

<script setup lang="ts">
import { cn } from '@/lib/utils'
import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command'
import { Button } from '@/components/ui/button'
import { Check, ChevronsUpDown } from 'lucide-vue-next'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ref, computed, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useSkillsStore } from '@/store/skillsStore'
import { SkillType } from '@/types/SkillType'

const props = defineProps<{
  modelValue: SkillType | null
  initialSkillId?: number
}>()

const emit = defineEmits<{
  'update:modelValue': [value: SkillType | null]
}>()

const skillsStore = useSkillsStore()
const { skills: allSkills } = storeToRefs(skillsStore)

const open = ref(false)
const value = computed({
  get: () => props.modelValue,
  set: (newValue) => emit('update:modelValue', newValue)
})

const selectedSkillLabel = computed(() => {
  return value.value ? value.value.label : 'Votre compétence...'
})

const handleSelect = (skill: SkillType) => {
  value.value = {
    id: skill.id,
    label: skill.label
  }
  open.value = false
}

watch(
  allSkills,
  (newSkills) => {
    if (props.initialSkillId && newSkills.length > 0) {
      const initialSkill = newSkills.find((skill) => skill.id === props.initialSkillId)
      if (initialSkill) {
        value.value = {
          id: initialSkill.id,
          label: initialSkill.label
        }
      }
    }
  },
  { immediate: true }
)

onMounted(async () => {
  await skillsStore.fetchSkills()
})
</script>
