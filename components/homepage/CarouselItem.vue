<script lang="ts" setup>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faUserSecret } from "@fortawesome/free-solid-svg-icons";

library.add(faUserSecret);

const props = defineProps<{
  project: ExtendedProject;
}>();

const project = props.project;

const truncatedDescription = computed(() => {
  if (project.descriptionDisplay.length > 180) {
    return project.descriptionDisplay.slice(0, 180) + "...";
  }
  return project.descriptionDisplay;
});
</script>
<template>
  <!-- space for shadow on hover-->
  <div class="epfl-card relative flex h-[calc(100%-16px)] w-full flex-col bg-white text-gray-700">
    <!-- Content Area -->
    <NuxtLink :to="{ name: 'projects-id', params: { id: project.id } }" class="flex flex-1 flex-col">
      <!-- Image Container -->
      <div class="flex items-center justify-center">
        <img :alt="project.name" :src="project.logo" class="h-48 w-full object-contain p-4" />
      </div>
      <!-- Text Content -->
      <div class="mx-2 p-4 text-gray-700">
        <h5 class="text-blue-gray-900 font-sans text-xl leading-snug font-semibold capitalize antialiased">
          {{ project.name }}
        </h5>
        <p class="font-sans text-sm leading-normal text-gray-500 antialiased">
          {{ truncatedDescription }}
        </p>
      </div>
    </NuxtLink>
    <!-- Icons Container -->
    <div class="mt-auto flex justify-end pr-4 pb-4">
      <InfoIcons :project="project" />
    </div>
  </div>
</template>
