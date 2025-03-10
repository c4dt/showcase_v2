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
  <div
    class="relative flex flex-col rounded-xl bg-white text-gray-700 shadow-md border border-blue-gray-100 hover:bg-zinc-100"
  >
    <!-- Content Area -->
    <NuxtLink :to="{ name: 'projects-id', params: { id: project.id } }" class="flex flex-col flex-1">
      <!-- Image Container -->
      <div class="flex items-center justify-center">
        <img :alt="project.name" :src="project.logo" class="p-4 object-contain w-full h-48" />
      </div>
      <!-- Text Content -->
      <div class="mx-2 p-4 text-gray-700">
        <h5 class="antialiased font-sans text-xl font-semibold leading-snug text-blue-gray-900 capitalize">
          {{ project.name }}
        </h5>
        <p class="antialiased font-sans text-sm leading-normal text-gray-500">
          {{ truncatedDescription }}
        </p>
      </div>
    </NuxtLink>
    <!-- Icons Container -->
    <div class="flex space-x-4 justify-end pb-4 pr-4 mt-auto">
      <a v-if="project.information" :href="project.information[0].url">
        <font-awesome :icon="['fa', 'newspaper']" class="fa-3x" />
      </a>
      <a v-if="project.url" :href="project.url">
        <font-awesome :icon="['fa', 'home']" class="fa-3x" />
      </a>
      <a v-if="project.code" :href="project.code.url">
        <font-awesome
          :icon="[
            project.code.type.toLowerCase().includes('github') ? 'fab' : 'fas',
            project.code.type.toLowerCase().includes('github') ? 'github' : 'code'
          ]"
          class="fa-3x"
        />
      </a>
    </div>
  </div>
</template>
