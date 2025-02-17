<script setup lang="ts">
  const { data: projects } = await useFetch("/api/projects");
  const project = projects.value.find((project) => project.id == useRoute().params.id);
  const { data: labs } = await useFetch("/api/labs");
  const lab = labs.value.labs[project.lab];
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
  <div class="flex m-16">
    <div class="pr-16 flex-[8] text-center divide-y divide-solid">
      <div class="py-4">
        <h1 class="header-h1">{{ project.name }}</h1>
        <p class="text-left py-4">{{ project.descriptionDisplay }}</p>
        <div class="flex space-x-4 text-left">
          <span
            class="px-3 py-1 rounded-full text-sm bg-gray-200 text-gray-800"
            v-for="tag in project.tags"
          >
            {{ tag }}
          </span>
        </div>
      <ProjectsTabs v-if="tabs.length" :tabs="tabs" :defaultTab="defaultTab"></ProjectsTabs>
      </div>
    </div>
    <div class="bg-gray-50 px-16 flex-[2] text-center divide-y divide-solid">
      <div class="py-4">
        <h1 class="header-h1">{{ project.lab }}</h1>
        <a class="link text-sm" :href="lab.url">{{ lab.name }}</a>
        <div>
          <p class="text-center py-4 text-l">
          <a class="link text-xl" :href="'mailto:' + lab.prof.email">Prof. {{ lab.prof.name.join(" ") }}</a><br/>
          </p>
        </div>
      </div>
      <div class="py-4 text-left text-sm">{{ lab.description }}</div>
    </div>
  </div>
</template>

<style scoped>
@import "./assets/css/products.css";

.header-h1 {
  @apply text-4xl font-bold
}

.header-h2 {
  @apply text-2xl font-bold
}

.link {
  @apply underline
}
</style>
