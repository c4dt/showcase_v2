<template>
  <div class="mx-auto bg-white rounded-xl shadow-md overflow-hidden">
    <div class="p-8 hover:bg-zinc-100 transition-colors duration-100">
      <!-- Special Tags on the Top Right -->
      <ProjectStatus :project="project" />
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
        <div v-if="projectInformationIcons.length" class="flex space-x-4 flex-nowrap">
          <a
            v-for="info in projectInformationIcons"
            :key="info.url"
            :href="info.url"
            class="text-gray-500 hover:text-gray-700"
            :aria-label="info.label"
          >
            <FontAwesomeIcon :icon="info.icon" class="fa-2x" />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faTags, faNewspaper, faFile, faHome, faCode, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

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

const projectInformationIcons = computed(() => {
  const icons = [];

  if (project.information) {
    project.information.forEach((info) => {
      const type = info.type.toLowerCase();
      if (type === "article") {
        icons.push({
          url: info.url,
          icon: faNewspaper,
          label: "Article"
        });
      } else if (type === "paper") {
        icons.push({
          url: info.url,
          icon: faFile,
          label: "Paper"
        });
      }
    });
  }

  if (project.url) {
    icons.push({
      url: project.url,
      icon: faHome,
      label: "Project Homepage"
    });
  }

  if (project.code) {
    icons.push({
      url: project.code.url,
      icon: project.code.type.toLowerCase().includes("github") ? faGithub : faCode,
      label: "Source Code"
    });
  }

  if (project.contacts && project.contacts.length) {
    icons.push({
      url: `mailto:${project.contacts.map((contact) => contact.email).join(",")}`,
      icon: faEnvelope,
      label: "Contact"
    });
  }

  return icons;
});
</script>
