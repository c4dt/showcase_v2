<script setup lang="ts">
const route = useRoute();
const searchQuery = ref<string>(typeof route.query.search === "string" ? route.query.search : "");

provide("searchQuery", searchQuery);
</script>
<template>
  <div>
    <Navbar />
    <NuxtPage />
  </div>
</template>
