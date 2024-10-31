import { cva, type VariantProps } from 'class-variance-authority'

export { default as GameCardImage } from './GameCardImage.vue'

export const gameCardImageVariants = cva('', {
  variants: {
    direction: {
      vertical: 'w-[200px]',
      horizontal: 'h-[100%] block'
    }
  },
  defaultVariants: {
    direction: 'vertical'
  }
})

export type GameCardImageVariants = VariantProps<typeof gameCardImageVariants>
