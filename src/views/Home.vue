  <script setup lang="ts">
  import BasePage from '@/components/layout/BasePage.vue';
  import WelcomeMessage from '@/components/home/WelcomeMessage.vue'
  import AuthButtons from '@/components/home/AuthButtons.vue'
  </script>

  <template>
    <BasePage title="">
      <div class="flex flex-col md:flex-row">
        <div class="w-full md:w-3/5 mx-auto h-full">
          <WelcomeMessage></WelcomeMessage>
          <AuthButtons></AuthButtons>
        </div>
        <div class="hidden md:block w-full md:w-1/2 h-full">
          <img src="../assets/joachimSmall.png" alt="" class="h-full w-auto object-cover">
        </div>
      </div>
    </BasePage>
  </template>

  <style scoped></style>