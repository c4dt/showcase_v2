<script setup lang="ts">
const route = useRoute();
const searchQuery = ref<string>(typeof route.query.search === "string" ? route.query.search : "");

provide("searchQuery", searchQuery);

watch(
  () => route.query,
  (newQuery) => {
    if (!newQuery.search) {
      // Reset the search value when navigating to the home page
      searchQuery.value = "";
    }
  }
);
</script>
<template>
  <div>
    <Navbar />
    <NuxtPage />
  </div>
</template>
