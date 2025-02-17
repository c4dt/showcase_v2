<script setup lang="ts">
  const { data: projects } = await useFetch("/api/projects");
  const project = projects.value.find((project) => project.id == useRoute().params.id);
  const { data: presentation } = await useFetch(`/api/presentation?id=${project.id}`);
  const { data: app } = await useFetch(`/api/app?id=${project.id}`);
  const { data: demo } = await useFetch(`/api/demo?id=${project.id}`);
  const { data: details } = await useFetch(`/api/details?id=${project.id}`);
  const { data: handsOn } = await useFetch(`/api/hands-on?id=${project.id}`);
  const { data: pilot } = await useFetch(`/api/pilot?id=${project.id}`);
  const tabs = [
    { id: "presentation", label: "Presentation", content: presentation.value },
    { id: "app", label: "App", content: app.value },
    { id: "demo", label: "Demo", content: demo.value },
    { id: "details", label: "Details", content: details.value },
    { id: "hands-on", label: "Hands-on", content: handsOn.value },
    { id: "pilot", label: "Pilot", content: pilot.value }
  ].filter((tab) => tab.content)
  const defaultTab = tabs.length ? tabs[0].id : null;
</script>
<template>
 {{ project.name }}
 <ProjectsTabs v-if="tabs.length" :tabs="tabs" :defaultTab="defaultTab"></ProjectsTabs>
</template>

<style scoped>
    @import "./assets/css/products.css";
</style>
