<script setup lang="ts">
import Layer from '@/components/test/layer.vue'
import SearchBar from '@/components/ui/inputs/searchbar/SearchBar.vue'
import BasePage from '@/components/layout/BasePage.vue'
import DatePicker from '@/components/ui/inputs/datePicker/DatePicker.vue'
</script>

<template>
  <!--  <Layer image-path="src/assets/evenements.png" />-->
  <BasePage title="Évènements">
    <section>
      <header class="flex gap-3">
        <SearchBar placeholder="Rechercher par jeu"></SearchBar>
        <DatePicker></DatePicker>
      </header>
    </section>
  </BasePage>
</template>

<style scoped></style>
