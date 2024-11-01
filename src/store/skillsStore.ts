import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { SkillType } from '@/types/SkillType'
import { httpBackend } from '@/lib/utils'

export const useSkillsStore = defineStore('skills', () => {
  const skills = ref<SkillType[]>([])

  async function fetchSkills() {
    if (skills.value.length) return

    try {
      skills.value = await httpBackend<SkillType[]>(`/api/utils/allSkills`)
    } catch (err) {
      console.error('Error fetching skills:', err)
    }
  }

  return {
    skills,
    fetchSkills
  }
})
