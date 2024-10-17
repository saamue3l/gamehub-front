<script setup lang="ts">
import Layer from '@/components/test/layer.vue'
import SearchBar from '@/components/ui/inputs/searchbar/SearchBar.vue'
import BasePage from '@/components/layout/BasePage.vue'
</script>

<template>
  <!--  <Layer image-path="src/assets/evenements.png" />-->
  <BasePage title="Évènements">
    <section>
      <header>
        <SearchBar></SearchBar>
      </header>
    </section>
  </BasePage>
</template>

<style scoped></style>
