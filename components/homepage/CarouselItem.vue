<script lang="ts" setup>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faUserSecret } from "@fortawesome/free-solid-svg-icons";

library.add(faUserSecret);

const props = defineProps<{
  project: ExtendedProject;
}>();

const project = props.project;
</script>
<template>
  <!-- use CSS to leave space for shadow when moving up on hover-->
  <div class="epfl-card relative flex h-[calc(100%-1rem)] w-full flex-col overflow-hidden bg-white text-gray-700">
    <!-- Content Area -->
    <NuxtLink
      :to="{ name: 'projects-id', params: { id: project.id } }"
      class="flex min-h-0 flex-1 flex-col overflow-hidden"
    >
      <!-- Image Container -->
      <div class="flex items-center justify-center">
        <img :alt="project.name" :src="project.logo" class="h-48 w-full object-contain p-4" />
      </div>
      <!-- Text Content -->
      <div class="mx-2 p-4 text-gray-700">
        <h5
          data-testid="header"
          class="text-blue-gray-900 line-clamp-2 font-sans text-xl leading-snug font-semibold capitalize antialiased"
        >
          {{ project.name }}
        </h5>
        <p data-testid="body" class="line-clamp-6 font-sans text-sm leading-normal text-gray-500 antialiased">
          {{ project.descriptionDisplay }}
        </p>
      </div>
    </NuxtLink>
    <!-- Icons Container -->
    <div class="mt-auto flex justify-center overflow-clip pb-4 sm:justify-end sm:pr-4">
      <InfoIcons :project="project" />
    </div>
  </div>
</template>
