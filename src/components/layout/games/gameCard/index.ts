import { cva, type VariantProps } from 'class-variance-authority'

export { default as GameCard } from './GameCard.vue'

export const gameCardVariants = cva('flex justify-between items-center cursor-pointer p-1.5', {
  variants: {
    direction: {
      vertical: 'flex-col w-[150px] min-w-[150px]',
      horizontal: 'flex-row w-full h-[70px] min-h-[70px] max-h-[70px]'
    }
  },
  defaultVariants: {
    direction: 'vertical'
  }
})

export type GameCardVariants = VariantProps<typeof gameCardVariants>
