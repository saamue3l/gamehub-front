<script setup lang="ts">
import WelcomeMessage from '@/components/home/WelcomeMessage.vue'
import AuthButtons from '@/components/home/AuthButtons.vue'
import { Card, CardContent } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel'
import Autoplay from 'embla-carousel-autoplay'
import eventsImage from '@/assets/events.jpg'
import profileImage from '@/assets/profile.jpg'
import forumImage from '@/assets/forum.jpg'


const images = [
  { src: eventsImage, alt: 'Events Image', title: 'Rejoins des événements' },
  { src: profileImage, alt: 'Profile Image', title: 'Customise ton profil' },
  { src: forumImage, alt: 'Forum Image', title: 'Discute avec la communauté' }
]

const plugin = Autoplay({
  delay: 4000,
  stopOnMouseEnter: true,
  stopOnInteraction: false
})
</script>

<template>
  <section class="md:w-3/5 w-4/5 mt-14">
    <div class="flex flex-col justify-between gap-5">
      <div class="flex flex-col md:flex-row">
        <!-- Left side with WelcomeMessage and AuthButtons -->
        <div class="w-full md:w-3/5 mx-auto flex flex-col justify-between">
          <WelcomeMessage></WelcomeMessage>
          <AuthButtons></AuthButtons>
        </div>

        <!-- Right side with image, matching left side height -->
        <div class="w-full md:w-2/5 items-center max-md:p-8">
          <Carousel
            class="relative w-full max-w-md"
            :plugins="[plugin]"
            @mouseenter="plugin.stop"
            @mouseleave="[plugin.reset(), plugin.play()]"
          >
            <CarouselContent>
              <CarouselItem v-for="(image, index) in images" :key="index">
                <Card>
                  <CardContent class="p-0">
                    <div class="relative h-full">
                      <img
                        :src="image.src"
                        :alt="image.alt"
                        class="object-cover w-full h-full rounded-lg"
                      />
                      <div
                        class="absolute bottom-0 left-0 right-0 bg-black/80 text-white p-4 rounded-lg"
                      >
                        <h3 class="text-xl font-semibold">{{ image.title }}</h3>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
          <!--
          joachim :'( <div class="relative w-full h-full">
            <img
              src="../assets/joachimSmall.png"
              alt=""
              class="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          -->
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.CarouselItem {
  transition: transform 0.3s ease;
}
</style>
