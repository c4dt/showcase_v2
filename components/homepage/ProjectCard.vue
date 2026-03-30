<template>
  <!-- use CSS to make parent relative on hover to move up -->
  <div data-testid="project-card" class="epfl-card mx-auto overflow-hidden bg-white hover:relative">
    <div class="p-8">
      <div class="sm:grid sm:grid-cols-2 sm:grid-cols-[2fr_1fr] sm:items-start sm:gap-x-[calc(5%)] sm:gap-y-[calc(5%)]">
        <div class="w-full sm:flex-1">
          <NuxtLink :to="{ name: 'projects-id', params: { id: project.id } }" class="block">
            <ProjectDescription :project="project" />
            <div class="block sm:hidden">
              <div class="mb-2">
                <p class="mt-2 text-sm font-semibold">{{ project.lab.prof.name.join(" ") }}</p>
                <p class="text-sm text-gray-500">{{ project.lab.name }}</p>
              </div>
              <ProjectQuality :project="project" />
            </div>
          </NuxtLink>
        </div>
        <div class="hidden sm:block sm:basis-64 sm:justify-end">
          <div class="mb-2">
            <p class="mt-2 text-sm font-semibold">{{ project.lab.prof.name.join(" ") }}</p>
            <p class="text-sm text-gray-500">{{ project.lab.name }}</p>
          </div>
          <ProjectQuality :project="project" />
        </div>
        <div class="mt-4 sm:mt-0">
          <div class="flex items-center space-x-2">
            <div class="flex flex-wrap gap-2">
              <span v-for="tag in project.tags.toSorted()" :key="tag" :class="tagClass(tag)" @click="addTag(tag)">
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
        <InfoIcons :project="project" class="hidden sm:flex" />
      </div>
      <InfoIcons :project="project" class="mt-4 block sm:hidden" />
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
