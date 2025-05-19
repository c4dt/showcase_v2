<template>
  Status: {{ projectStatus }}
  <br />
  Timeline: {{ project.incubator.work }}
  <ul class="ul">
    <li v-for="product in project.incubator.products" :key="product">
      <a class="epfl-a" :href="product.url">{{ product.title }}</a>
    </li>
  </ul>
</template>
<script lang="ts" setup>
const props = defineProps<{
  project: ExtendedProject;
}>();
const project = props.project;
const projectStatus = project.incubator.type.startsWith("incubated")
  ? PROJECT_C4DT_STATUS.ACTIVE
  : PROJECT_C4DT_STATUS.RETIRED;
</script>
