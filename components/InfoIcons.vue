<template>
  <div data-testid="info-icons" class="flex flex-nowrap space-x-4">
    <NuxtLink
      v-if="papers"
      :class="iconClass"
      :to="{ name: 'projects-id', params: { id: project.id }, query: { section: TAB_IDS.PAPERS } }"
      aria-label="Papers"
      ><FontAwesomeIcon :icon="faFile" class="fa-2x" title="Papers"
    /></NuxtLink>
    <FontAwesomeIcon v-else :icon="faFile" class="fa-2x text-[#e6e6e6]" title="Papers" />
    <NuxtLink
      v-if="articles"
      :class="iconClass"
      :to="{ name: 'projects-id', params: { id: project.id }, query: { section: TAB_IDS.ARTICLES } }"
      aria-label="Articles"
      ><FontAwesomeIcon :icon="faNewspaper" class="fa-2x" title="Articles"
    /></NuxtLink>
    <FontAwesomeIcon v-else :icon="faNewspaper" class="fa-2x text-[#e6e6e6]" title="Articles" />
    <div v-for="info in projectInformationIcons" :key="info" class="flex flex-nowrap space-x-4">
      <a v-if="info.url" :key="info.url" :href="info.url" :class="iconClass" :aria-label="info.label">
        <FontAwesomeIcon :icon="info.icon" class="fa-2x" :title="info.label" />
      </a>
      <FontAwesomeIcon v-else :icon="info.icon" class="fa-2x text-[#e6e6e6]" :title="info.label" />
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
const iconClass = "text-[#707070] hover:text-[#212121]";

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
  } else {
    icons.push({
      url: "",
      icon: faHome
    });
  }

  if (project.code) {
    icons.push({
      url: project.code.url,
      icon: project.code.type.toLowerCase().includes("github") ? faGithub : faCode,
      label: "Source Code"
    });
  } else {
    icons.push({
      url: "",
      icon: faCode
    });
  }

  if (project.contacts && project.contacts.length) {
    icons.push({
      url: `mailto:${project.contacts.map((contact) => contact.email).join(",")}`,
      icon: faEnvelope,
      label: "Contact"
    });
  } else {
    icons.push({
      url: "",
      icon: faEnvelope
    });
  }

  return icons;
});
</script>
