<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { AlertCircle, Upload, X } from 'lucide-vue-next'
import { FormControl, FormItem, FormLabel } from '@/components/ui/form'
import { useField } from 'vee-validate'
import { Cropper, CircleStencil } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'
import { useToast } from '@/components/ui/toast/use-toast'

interface Props {
  name: string
  label?: string
  maxSize?: number
  aspectRatio?: number
  cropperMinWidth?: number
  cropperMinHeight?: number
  cropperMaxWidth?: number
  cropperMaxHeight?: number
  circular?: boolean
  quality?: number
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Photo de profil',
  maxSize: 5,
  aspectRatio: 1,
  cropperMinWidth: 50,
  cropperMinHeight: 50,
  cropperMaxWidth: 600,
  cropperMaxHeight: 600,
  circular: true,
  quality: 0.9
})

const emit = defineEmits<{
  (e: 'fileChanged', file: File | null): void
  (e: 'error', error: Error): void
}>()

// Composables
const { toast } = useToast()
const { value: fieldValue, errorMessage } = useField(props.name)

// Refs
const fileInputRef = ref<HTMLInputElement | null>(null)
const cropperRef = ref(null)
const boundary = ref(document.body)
const cropperHeight = ref(400)

// État
const state = ref({
  isUploading: false,
  showCropDialog: false,
  imagePreview: null as string | null,
  imageToCrop: null as string | null
})

const stencilProps = computed(() => ({
  aspectRatio: props.aspectRatio,
  minWidth: props.cropperMinWidth,
  minHeight: props.cropperMinHeight,
  maxWidth: props.cropperMaxWidth,
  maxHeight: props.cropperMaxHeight,
  movable: true,
  resizable: true,
  class: 'custom-stencil'
}))

// Méthodes
const getMaxDialogHeight = () => {
  const windowHeight = window.innerHeight
  const padding = 120 // Augmenté pour donner plus d'espace
  return windowHeight - padding
}

const updateCropperHeight = () => {
  cropperHeight.value = Math.min(400, getMaxDialogHeight())
}

const validateFile = (file: File): boolean => {
  if (!file.type.startsWith('image/')) {
    toast({
      title: 'Erreur',
      description: 'Veuillez sélectionner une image',
      variant: 'destructive'
    })
    return false
  }

  if (file.size > props.maxSize * 1024 * 1024) {
    toast({
      title: 'Erreur',
      description: `L'image ne doit pas dépasser ${props.maxSize}MB`,
      variant: 'destructive'
    })
    return false
  }

  return true
}

const handleFileChange = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file || !validateFile(file)) {
    resetInput()
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    state.value.imageToCrop = e.target?.result as string
    state.value.showCropDialog = true
  }
  reader.readAsDataURL(file)
}

const dataURLtoFile = (dataUrl: string, filename: string): File => {
  const arr = dataUrl.split(',')
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg'
  const bstr = atob(arr[1])
  const u8arr = new Uint8Array(bstr.length)

  for (let i = 0; i < bstr.length; i++) {
    u8arr[i] = bstr.charCodeAt(i)
  }

  return new File([u8arr], filename, { type: mime })
}

const crop = async () => {
  if (!cropperRef.value) return

  try {
    const { canvas } = (cropperRef.value as any).getResult()
    const croppedImage = canvas.toDataURL('image/jpeg', props.quality)

    state.value.showCropDialog = false

    // Créer le fichier à partir de l'image recadrée
    const file = dataURLtoFile(croppedImage, 'profile.jpg')

    // Mettre à jour la prévisualisation
    state.value.imagePreview = croppedImage

    // Émettre le fichier pour le formulaire parent
    emit('fileChanged', file)

    toast({
      title: 'Succès',
      description: 'Image recadrée avec succès'
    })
  } catch (error: any) {
    emit('error', error)
    toast({
      title: 'Erreur',
      description: error.message || 'Erreur lors du recadrage',
      variant: 'destructive'
    })
    state.value.imagePreview = null
  } finally {
    resetInput()
  }
}

const resetImage = () => {
  state.value.imagePreview = null
  fieldValue.value = ''
  emit('fileChanged', null)
  resetInput()
}

const resetInput = () => {
  if (fileInputRef.value) fileInputRef.value.value = ''
}

// Lifecycle hooks
onMounted(() => {
  updateCropperHeight()
  window.addEventListener('resize', updateCropperHeight)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateCropperHeight)
})
</script>

<template>
  <FormItem>
    <div class="flex items-center justify-between">
      <FormLabel>{{ label }}</FormLabel>

      <template v-if="errorMessage">
        <!-- Desktop -->
        <TooltipProvider class="hidden md:block">
          <Tooltip>
            <TooltipTrigger asChild>
              <AlertCircle class="h-3.5 w-3.5 text-destructive" />
            </TooltipTrigger>
            <TooltipContent
              side="top"
              :avoid-collisions="true"
              :collision-boundary="boundary"
              sticky="partial"
              class="max-w-xs"
              :hide-when-detached="true"
              :arrow-padding="5"
              :collision-padding="10"
              align="center"
              :align-offset="0"
            >
              <p>{{ errorMessage }}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <!-- Mobile -->
        <Popover class="md:hidden">
          <PopoverTrigger asChild>
            <AlertCircle class="h-3.5 w-3.5 text-destructive" />
          </PopoverTrigger>
          <PopoverContent class="w-72" side="right">
            <p class="text-sm text-destructive">{{ errorMessage }}</p>
          </PopoverContent>
        </Popover>
      </template>
    </div>

    <FormControl>
      <div class="relative">
        <input
          ref="fileInputRef"
          type="file"
          accept="image/*"
          class="hidden"
          @change="handleFileChange"
        />

        <div class="flex items-center gap-4">
          <!-- Image Preview -->
          <div v-if="state.imagePreview" class="relative h-10 w-10 shrink-0">
            <div class="h-full w-full overflow-hidden rounded-full bg-secondary">
              <img :src="state.imagePreview" alt="Preview" class="h-full w-full object-cover" />
            </div>
            <Button
              type="button"
              variant="destructive"
              size="icon"
              class="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0"
              @click.stop="resetImage"
            >
              <X class="h-3 w-3" />
            </Button>
          </div>

          <!-- Upload Button -->
          <div
            class="flex-1 rounded-md border border-input px-3 py-2 text-sm ring-offset-background"
            :class="{
              'border-destructive': errorMessage,
              'opacity-50': state.isUploading
            }"
          >
            <Button
              type="button"
              variant="ghost"
              :disabled="state.isUploading"
              class="h-full w-full justify-start p-0 font-normal"
              @click="fileInputRef?.click()"
            >
              <div class="flex items-center gap-2">
                <Upload class="h-4 w-4" />
                <span>{{
                  state.isUploading
                    ? 'Upload en cours...'
                    : state.imagePreview
                      ? "Changer d'image"
                      : 'Choisir une image'
                }}</span>
                <span class="text-xs text-muted-foreground">
                  (PNG, JPG - max. {{ maxSize }}MB)
                </span>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </FormControl>

    <!-- Crop Dialog -->
    <Dialog v-model:open="state.showCropDialog" @close="resetInput">
      <DialogContent class="sm:max-w-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader class="flex-shrink-0">
          <DialogTitle>Recadrer l'image</DialogTitle>
        </DialogHeader>

        <div class="flex-grow overflow-hidden py-4">
          <div class="relative h-full w-full">
            <Cropper
              ref="cropperRef"
              :src="state.imageToCrop"
              :stencil-component="CircleStencil"
              :stencil-props="stencilProps"
              class="max-h-full"
              :style="{ height: `${cropperHeight}px` }"
              :default-size="{
                width: 300,
                height: 300
              }"
              :zoom-speed="1"
              :background-class="'bg-muted'"
              :image-restriction="'stencil'"
            />
          </div>
        </div>

        <DialogFooter class="flex-shrink-0">
          <Button
            type="button"
            variant="secondary"
            :disabled="state.isUploading"
            @click="state.showCropDialog = false"
          >
            Annuler
          </Button>
          <Button type="button" :disabled="state.isUploading" @click="crop">
            {{ state.isUploading ? 'Traitement...' : 'Valider' }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </FormItem>
</template>
