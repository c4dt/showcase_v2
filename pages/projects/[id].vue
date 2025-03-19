<script setup lang="ts">
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faTags, faEnvelope } from "@fortawesome/free-solid-svg-icons";
const project = useState<ExtendedProject>(`project-${useRoute().params.id}`);
const lab = project.value.lab;
const articles = project.value.information
  ? project.value.information.filter((information) => information.type.toLowerCase() === "article")
  : [];
const papers = project.value.information
  ? project.value.information.filter((information) => information.type.toLowerCase() === "paper")
  : [];
const aClass = "underline text-[#212121] hover:text-[#ff0000] decoration-[#ff0000] hover:decoration-[#212121]";
const papersContent = papers.length
  ? `<ul class='ul'>${papers.map((paper) => `<li><a class='${aClass}' href=${paper.url}>${paper.title}</a></li>`).join("")}</ul>`
  : "";
const articlesContent = articles.length
  ? `<ul class='ul'>${articles.map((article) => `<li><a class='${aClass}' href=${article.url}>${article.title}</a></li>`).join("")}</ul>`
  : "";
const codeInfos = (
  project.value.code
    ? [
        project.value.code.type
          ? `Source code: <a class="${aClass} "href=${project.value.code.url}>${project.value.code.type}</a>`
          : "",
        project.value.code.date_last_commit ? `Last commit: ${project.value.code.date_last_commit}` : ""
      ]
    : []
).join("<br />");
const pprintMaturity = project.value.maturity
  ? "Code quality: " +
    new Map([
      [0, "Maturity evaluation possible upon request"],
      [1, "Prototype"],
      [2, "Intermediate"],
      [3, "Mature"]
    ]).get(project.value.maturity)
  : "";
const technicalInfos = [
  `Project type: ${project.value.type}`,
  codeInfos,
  project.value.license ? `License: ${project.value.license}` : "",
  project.value.language ? `Language(s): ${project.value.language}` : "",
  pprintMaturity
].join("<br />");
const technicalContent = `<p>${technicalInfos}</p>`;

const tabs = useState<ProjectTab[]>(`project-${useRoute().params.id}-tabs`);

tabs.value = [
  ...tabs.value,
  { id: "papers", label: "Research papers", content: papersContent },
  { id: "articles", label: "Miscellaneous publications", content: articlesContent },
  { id: "technical", label: "Technical", content: technicalContent }
].filter((tab) => tab.content);

const lastEdited = new Date(Date.parse(project.value.date_updated || project.value.date_added));
</script>
<template>
  <div class="flex m-16">
    <div class="pr-16 flex-[7] text-center">
      <div class="py-4">
        <p class="text-xs py-4">This page was last edited on {{ lastEdited.toDateString() }}.</p>
        <div class="flex items-center justify-center">
          <img :alt="project.name" :src="project.logo" class="p-4 object-contain w-full h-48" />
        </div>
        <ProjectStatus :project="project" />
        <ProjectDescription :project="project" />
        <div class="flex items-center space-x-2 text-left">
          <FontAwesomeIcon :icon="faTags" class="text-gray-500" />
          <span
            v-for="tag in project.tags"
            :key="tag"
            class="px-3 py-1 rounded-full text-sm bg-[#d5d5d5] text-[#707070]"
          >
            {{ tag }}
          </span>
        </div>
      </div>
      <ProjectsTabs v-if="tabs.length" :tabs="tabs" />
    </div>
    <div class="flex-[3]">
      <div class="px-8 bg-[#e6e6e6] text-center">
        <div class="py-4">
          <h1 class="text-4xl font-bold">{{ project.lab.name }}</h1>
          <a
            class="underline text-[#212121] hover:text-[#ff0000] decoration-[#ff0000] hover:decoration-[#212121] text-sm"
            :href="lab.url"
            >{{ lab.name }}</a
          >
          <div>
            <div class="flex justify-center py-4">
              <NuxtImg
                v-if="lab.prof.picture"
                class="rounded-full"
                :src="`/labs/${lab.prof.picture}`"
                :alt="lab.prof.name.join(' ')"
              />
            </div>
            <p class="text-center text-l">
              Prof. {{ lab.prof.name.join(" ") }}
              <br />
              <a
                class="underline text-[#212121] hover:text-[#ff0000] decoration-[#ff0000] hover:decoration-[#212121] text-xl"
                :href="'mailto:' + lab.prof.email"
                ><FontAwesomeIcon :icon="faEnvelope" class="text-[#707070]" /></a
              ><br />
            </p>
          </div>
        </div>
        <div class="py-4 text-left text-sm" v-html="lab.description" />
      </div>
    </div>
  </div>
</template>
