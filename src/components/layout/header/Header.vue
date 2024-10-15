<script setup lang="ts">

import { routes } from '@/router/index.js'
</script>

<template>
  <header>
    <!--  Quick header  -->
    <ul>
      <li v-for="route in routes">
        <router-link :to="route.path">{{ route.name }}</router-link>
      </li>
    </ul>
  </header>
</template>

<style scoped>
header {
  width: 100%;
  padding: 13px;
  background-color: #262626;
  line-height: 1.5;

  ul {
    display: flex;
    gap: 13px;
    list-style-type: none;

    li {
      padding: 3px;
      background-color: #3d3d3d;
    }
  }
}

a.router-link-active {
  color: aquamarine;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }
}
</style>