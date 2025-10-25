import { UserStore } from '@/store/userStore'
import { useAchievementsStore } from '@/store/achievementsStore'
import { useToast } from '@/components/ui/toast'
import { useXpAnimationStore } from '@/store/xpAnimationStore'
import type { XpAndSuccessResponse } from '@/types/Success'

export function useActionHandler() {
  const { toast } = useToast()
  const userStore = UserStore()
  const achievementsStore = useAchievementsStore()

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  const handleActionResponse = async (
    response: XpAndSuccessResponse,
    customToast?: {
      title: string
      description: string
    }
  ) => {
    const xpAnimationStore = useXpAnimationStore()
    const toasts: Array<() => void> = []

    if (customToast) {
      toasts.push(() => toast(customToast))
    }

    if (response.xpGained) {
      const oldXp = userStore.xp
      const oldLevel = userStore.level
      const newXp = oldXp + response.xpGained

      userStore.updateXp(newXp)
      xpAnimationStore.showXpGain(response.xpGained)

      if (Math.floor(newXp / 100) > oldLevel) {
        await delay(1000)
        xpAnimationStore.showLevelUp(oldLevel, userStore.level)
      }
    }
    if (response.newSuccess) {
      achievementsStore.addNewAchievement({
        id: Date.now(),
        name: response.newSuccess.name,
        description: response.newSuccess.description
      })

      toasts.push(() =>
        toast({
          title: '🏆 Nouveau succès !',
          description: `${response.newSuccess.name} - ${response.newSuccess.description}`
        })
      )
    }

    for (let i = 0; i < toasts.length; i++) {
      toasts[i]()
      if (i < toasts.length - 1) {
        await delay(2000)
      }
    }
  }

  return {
    handleActionResponse
  }
}
