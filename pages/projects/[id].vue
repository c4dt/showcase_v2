<script setup lang="ts">
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faTags, faEnvelope } from "@fortawesome/free-solid-svg-icons";
const { data: projects } = await useFetch("/api/projects");
const project = projects.value.find((project) => project.id == useRoute().params.id);
const lab = project.lab;
const articles = project.information
  ? project.information.filter((information) => information.type.toLowerCase() === "article")
  : [];
const papers = project.information
  ? project.information.filter((information) => information.type.toLowerCase() === "paper")
  : [];
const aClass = "underline text-[#212121] hover:text-[#ff0000] decoration-[#ff0000] hover:decoration-[#212121]";
const papersContent = papers.length
  ? `<ul class='ul'>${papers.map((paper) => `<li><a class='${aClass}' href=${paper.url}>${paper.title}</a></li>`).join("")}</ul>`
  : "";
const articlesContent = articles.length
  ? `<ul class='ul'>${articles.map((article) => `<li><a class='${aClass}' href=${article.url}>${article.title}</a></li>`).join("")}</ul>`
  : "";
const { data: presentation } = await useFetch(`/api/templates?id=${project.id}&type=presentation`);
const { data: app } = await useFetch(`/api/templates?id=${project.id}&type=app`);
const { data: demo } = await useFetch(`/api/templates?id=${project.id}&type=demo`);
const { data: details } = await useFetch(`/api/templates?id=${project.id}&type=details`);
const { data: handsOn } = await useFetch(`/api/templates?id=${project.id}&type=hands-on`);
const { data: pilot } = await useFetch(`/api/templates?id=${project.id}&type=pilot`);
const tabs = [
  { id: "presentation", label: "Presentation", content: presentation.value },
  { id: "app", label: "App", content: app.value },
  { id: "demo", label: "Demo", content: demo.value },
  { id: "details", label: "Details", content: details.value },
  { id: "hands-on", label: "Hands-on", content: handsOn.value },
  { id: "pilot", label: "Pilot", content: pilot.value },
  { id: "papers", label: "Research papers", content: papersContent },
  { id: "articles", label: "Miscellaneous publications", content: articlesContent }
].filter((tab) => tab.content);
const defaultTab = tabs.length ? tabs[0].id : null;
const lastEdited = new Date(Date.parse(project.date_updated ? project.date_updated : project.date_added));
</script>
<template>
  <div class="flex m-16">
    <div class="pr-16 flex-[8] text-center divide-y divide-solid">
      <div class="py-4">
        <h1 class="text-4xl font-bold">{{ project.name }}</h1>
        <p class="text-xs py-4">This page was last edited on {{ lastEdited.toDateString() }}.</p>
          <div class="flex items-center justify-center">
            <img :alt="project.name" :src="project.logo" class="p-4 object-contain w-full h-48" />
          </div>
        <p class="text-left py-4">{{ project.description }}</p>
        <p class="text-left pb-4 text-gray-600">{{ project.laymen_desc || project.tech_desc }}</p>
        <div class="flex items-center space-x-2 text-left">
          <FontAwesomeIcon :icon="faTags" class="text-gray-500" />
          <span v-for="tag in project.tags" class="px-3 py-1 rounded-full text-sm bg-[#d5d5d5] text-[#707070]">
            {{ tag }}
          </span>
        </div>
      </div>
      <div><ProjectsTabs v-if="tabs.length" :tabs="tabs" :default-tab="defaultTab" /></div>
    </div>
    <div class="flex-[2]">
      <div class="px-16 bg-[#d5d5d5] text-center divide-y divide-solid">
        <div class="py-4">
          <h1 class="text-4xl font-bold">{{ project.lab.name }}</h1>
          <a
            class="underline text-[#212121] hover:text-[#ff0000] decoration-[#ff0000] hover:decoration-[#212121] text-sm"
            :href="lab.url"
            >{{ lab.name }}</a
          >
          <div>
          <div class="flex justify-center py-4"><NuxtImg class="rounded-full" v-if="lab.prof.picture" :src="`/labs/${lab.prof.picture}`" :alt="lab.prof.name.join(' ')"  /></div>
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
        <div class="py-4 text-left text-sm" v-html="lab.description"/>
      </div>
    </div>
  </div>
</template>
