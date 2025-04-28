<template>
  <div class="mx-auto bg-white rounded-xl shadow-md overflow-hidden">
    <div class="p-8 hover:bg-zinc-100 transition-colors duration-100">
      <!-- Special Tags on the Top Right -->
      <ProjectQuality :project="project" />
      <NuxtLink :to="{ name: 'projects-id', params: { id: project.id } }" class="block">
        <div class="flex items-start">
          <!-- Left Side: Project Name and Description -->
          <div class="grow">
            <ProjectDescription :project="project" />
            <h3>Professor: {{ project.lab.prof.name.join(" ") }}</h3>
            <h3>Lab: {{ project.lab.name }}</h3>
          </div>
        </div>
      </NuxtLink>
      <!-- Bottom Section: Tags and Icons -->
      <div class="flex justify-between items-end mt-4">
        <!-- Tags on the Left -->
        <div class="flex items-center space-x-2">
          <FontAwesomeIcon :icon="faTags" class="text-gray-500" />
          <div class="flex flex-wrap gap-2">
            <span v-for="tag in project.tags" :key="tag" :class="tagClass(tag)" @click="addTag(tag)">
              {{ tag }}
            </span>
          </div>
        </div>
        <!-- Icons on the Right -->
        <div class="flex space-x-4 flex-nowrap">
          <InfoIcons :project="project" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faTags } from "@fortawesome/free-solid-svg-icons";

const props = defineProps<{
  project: ExtendedProject;
}>();
const project = props.project;

const selectedTags = inject("selectedTags") as Ref<string[]>;
const addTag = inject("addTag") as (tag: string) => void;

const tagClass = (tag: string) =>
  selectedTags.value.includes(tag)
    ? "px-3 py-1 rounded-full text-sm bg-gray-400 text-gray-950 cursor-not-allowed transition"
    : "px-3 py-1 rounded-full text-sm bg-gray-200 text-gray-800 cursor-pointer hover:bg-gray-300 hover:text-gray-900 transition";
</script>
