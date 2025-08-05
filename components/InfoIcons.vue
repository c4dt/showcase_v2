<template>
  <div class="flex flex-nowrap space-x-4">
    <NuxtLink
      v-if="papers"
      :class="iconClass"
      :to="{ name: 'projects-id', params: { id: project.id }, query: { section: TAB_IDS.PAPERS } }"
      ><FontAwesomeIcon :icon="faFile" class="fa-2x"
    /></NuxtLink>
    <NuxtLink
      v-if="articles"
      :class="iconClass"
      :to="{ name: 'projects-id', params: { id: project.id }, query: { section: TAB_IDS.ARTICLES } }"
      ><FontAwesomeIcon :icon="faNewspaper" class="fa-2x"
    /></NuxtLink>
    <div v-if="projectInformationIcons.length" class="flex flex-nowrap space-x-4">
      <a
        v-for="info in projectInformationIcons"
        :key="info.url"
        :href="info.url"
        :class="iconClass"
        :aria-label="info.label"
      >
        <FontAwesomeIcon :icon="info.icon" class="fa-2x" />
      </a>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faNewspaper, faFile, faHome, faCode, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

const props = defineProps<{
  project: ExtendedProject;
}>();
const project = props.project;
const iconClass = "text-gray-500 hover:text-gray-700";

const articles = project.information
  ? project.information.some((info) => info.type.toLowerCase() === "article")
  : false;
const papers = project.information ? project.information.some((info) => info.type.toLowerCase() === "paper") : false;

const projectInformationIcons = computed(() => {
  const icons = [];

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
