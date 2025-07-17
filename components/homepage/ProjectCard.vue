<template>
  <div class="mx-auto overflow-hidden rounded-xl bg-white shadow-md">
    <div class="p-8 transition-colors duration-100 hover:bg-zinc-100">
      <div class="flex items-start">
        <div class="sm:flex-1">
          <NuxtLink :to="{ name: 'projects-id', params: { id: project.id } }" class="block">
            <ProjectDescription :project="project" />
            <h3>Professor: {{ project.lab.prof.name.join(" ") }}</h3>
            <h3>Lab: {{ project.lab.name }}</h3>
            <div class="block sm:hidden">
              <ProjectQuality :project="project" />
            </div>
          </NuxtLink>
        </div>
        <div class="hidden sm:block sm:flex-shrink-0 sm:flex-grow-0 sm:basis-64 sm:justify-end">
          <ProjectQuality :project="project" />
        </div>
      </div>
      <!-- Bottom Section: Tags and Icons -->
      <div class="mt-4 flex items-end justify-between">
        <!-- Tags on the Left -->
        <div class="flex items-center space-x-2">
          <div class="flex flex-wrap gap-2">
            <span v-for="tag in project.tags.toSorted()" :key="tag" :class="tagClass(tag)" @click="addTag(tag)">
              {{ tag }}
            </span>
          </div>
        </div>
        <!-- Icons on the Right -->
        <div class="flex flex-nowrap space-x-4">
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

const tagClass = (tag: string) => (selectedTags.value.includes(tag) ? "epfl-tag-plain" : "epfl-tag-light");
</script>
