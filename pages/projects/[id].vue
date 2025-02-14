<script setup lang="ts">
  const { data: projects } = await useFetch("/api/projects");
  const project = projects.value.find((project) => project.id == useRoute().params.id);
</script>
<template>{{ project.name }}</template>
