import { cva, type VariantProps } from 'class-variance-authority'

export const spinnerVariants = cva('animate-spin lucide lucide-loader-circle-icon', {
  variants: {
    size: {
      default: 'w-4 h-4 m-2',
      xs: 'w-1 h-1 m-1',
      sm: 'w-2 h-2 m-1',
      lg: 'w-7 h-7 m-3',
      xl: 'w-12 h-12 m-4',
      icon: 'w-10 h-10 m-4'
    }
  },
  defaultVariants: {
    size: 'default'
  }
})

export type SpinnerVariants = VariantProps<typeof spinnerVariants>
