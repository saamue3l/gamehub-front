<script setup lang="ts">
import TitledMediumContent from '@/components/layout/main/TitledMediumContent.vue'
import Layer from '@/components/test/layer.vue'
import SearchBar from '@/components/ui/inputs/searchbar/SearchBar.vue'
</script>

<template>
  <Layer image-path="src/assets/evenements.png" />
  <TitledMediumContent title="Évènements">
    <section>
      <header>
        <SearchBar></SearchBar>
      </header>
    </section>
  </TitledMediumContent>
</template>

<style scoped></style>
