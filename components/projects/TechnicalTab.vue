<template>
  <ul class="list-none">
    <li v-if="project.code?.url && project.code?.type">
      Source code:
      <a class="epfl-a" :href="project.code.url">{{ project.code.type }}</a>
    </li>
    <li v-if="project.code?.date_last_commit">Last commit: {{ project.code.date_last_commit }}</li>
  </ul>
</template>
<script lang="ts" setup>
const props = defineProps<{
  project: ExtendedProject;
}>();
const project = props.project;
</script>
