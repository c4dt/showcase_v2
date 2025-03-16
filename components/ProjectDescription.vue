<template>
  <h2 class="text-2xl font-bold mb-2">{{ project.name }}</h2>
  <h3>{{ project.description }}</h3>
  <p class="text-gray-600 mb-4">{{ project.laymen_desc || project.tech_desc }}</p>
</template>
<script lang="ts" setup>
const props = defineProps<{
  project: ExtendedProject;
}>();
const project = props.project;
</script>
