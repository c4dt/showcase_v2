<template>
  <h2 class="mb-2 text-2xl font-bold">{{ project.name }}</h2>
  <h3>{{ project.description }}</h3>
  <p class="text-gray-600">{{ project.laymen_desc || project.tech_desc }}</p>
</template>
<script lang="ts" setup>
const props = defineProps<{
  project: ExtendedProject;
}>();
const project = props.project;
</script>
