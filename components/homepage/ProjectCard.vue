<template>
  <div class="mx-auto bg-white rounded-xl shadow-md overflow-hidden">
    <div class="p-8 hover:bg-zinc-100 transition-colors duration-100">
      <div class="flex items-start">
        <div class="sm:flex-1">
          <NuxtLink :to="{ name: 'projects-id', params: { id: project.id } }" class="block">
            <ProjectDescription :project="project" />
            <h3>Professor: {{ project.lab.prof.name.join(" ") }}</h3>
            <h3>Lab: {{ project.lab.name }}</h3>
            <div class="sm:hidden block">
              <ProjectQuality :project="project" />
            </div>
          </NuxtLink>
        </div>
        <div class="hidden sm:block sm:justify-end sm:basis-64 sm:flex-shrink-0 sm:flex-grow-0">
          <ProjectQuality :project="project" />
        </div>
      </div>
      <!-- Bottom Section: Tags and Icons -->
      <div class="flex justify-between items-end mt-4">
        <!-- Tags on the Left -->
        <div class="flex items-center space-x-2">
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
const props = defineProps<{
  project: ExtendedProject;
}>();
const project = props.project;

const selectedTags = inject("selectedTags") as Ref<string[]>;
const addTag = inject("addTag") as (tag: string) => void;

const tagClass = (tag: string) => (selectedTags.value.includes(tag) ? "epfl-tag-non-link" : "epfl-tag-link");
</script>
