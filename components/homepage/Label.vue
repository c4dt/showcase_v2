<script setup lang="ts">
defineProps<{
  id: string;
  title: string;
}>();
</script>

<template>
  <!-- label for a filter input -->
  <label :for="id">Filter by {{ title.toLowerCase() }}</label>
</template>
