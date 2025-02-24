<script setup lang="ts">
const { data: projects } = await useFetch("/api/projects");
const project = projects.value.find((project) => project.id == useRoute().params.id);
const { data: labs } = await useFetch("/api/labs");
const lab = labs.value.labs[project.lab];
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
  { id: "pilot", label: "Pilot", content: pilot.value }
].filter((tab) => tab.content);
const defaultTab = tabs.length ? tabs[0].id : null;
const lastEdited = new Date(Date.parse(project.date_updated ? project.date_updated : project.date_added));

let projectStatus: { StyleClass: string; text: string };
projectStatus = computed(() => {
  if (project.code && project.code.date_last_commit) {
    if (isActive(project.code.date_last_commit)) {
      return {
        StyleClass:
          "px-3 py-1 bg-green-200 text-green-800  border-green-500 border-solid border-1px rounded-full text-sm",
        text: "Active"
      };
    } else {
      return {
        StyleClass: "px-3 py-1 bg-red-200 text-red-800 border-red-500 border-solid border-1px rounded-full text-sm",
        text: "Inactive"
      };
    }
  } else {
    return {
      StyleClass: "px-3 py-1 bg-gray-200 text-gray-800 border-gray-500 border-solid border-1px rounded-full text-sm",
      text: "Unknown"
    };
  }
});

const articles = project.information
  ? project.information.filter((information) => information.type.toLowerCase() === "article")
  : [];
const papers = project.information
  ? project.information.filter((information) => information.type.toLowerCase() === "paper")
  : [];
</script>
<template>
  <div class="flex m-16">
    <div class="pr-16 flex-[8] text-center divide-y divide-solid">
      <div class="py-4">
        <h1 class="text-4xl font-bold">{{ project.name }}</h1>
        <p class="text-xs py-4">This page was last edited on {{ lastEdited.toDateString() }}.</p>
        <span :class="projectStatus.StyleClass">{{ projectStatus.text }}</span>
      </div>
      <div class="py-4">
        <p class="text-left py-4">{{ project.descriptionDisplay }}</p>
        <div class="flex space-x-4 text-left">
          <span class="px-3 py-1 rounded-full text-sm bg-[#d5d5d5] text-[#707070]" v-for="tag in project.tags">
            {{ tag }}
          </span>
        </div>
      </div>
      <div class="py-4 text-left">
        <div v-if="papers.length">
          <h2 class="text-2xl font-bold">Papers</h2>
          <ul class="ul">
            <li v-for="paper in papers">
              <a
                :href="paper.url"
                class="underline text-[#212121] hover:text-[#ff0000] decoration-[#ff0000] hover:decoration-[#212121]"
                >{{ paper.title }}</a
              >
            </li>
          </ul>
        </div>
        <div v-if="articles.length">
          <h2 class="text-2xl font-bold">Articles</h2>
          <ul class="ul">
            <li v-for="article in articles">
              <a
                :href="article.url"
                class="underline text-[#212121] hover:text-[#ff0000] decoration-[#ff0000] hover:decoration-[#212121]"
                >{{ article.title }}</a
              >
            </li>
          </ul>
        </div>
      </div>
      <div><ProjectsTabs v-if="tabs.length" :tabs="tabs" :defaultTab="defaultTab"></ProjectsTabs></div>
    </div>
    <div class="flex-[2]">
      <div class="px-16 bg-[#d5d5d5] text-center divide-y divide-solid">
        <div class="py-4">
          <h1 class="text-4xl font-bold">{{ project.lab }}</h1>
          <a
            class="underline text-[#212121] hover:text-[#ff0000] decoration-[#ff0000] hover:decoration-[#212121] text-sm"
            :href="lab.url"
            >{{ lab.name }}</a
          >
          <div>
            <p class="text-center py-4 text-l">
              <a
                class="underline text-[#212121] hover:text-[#ff0000] decoration-[#ff0000] hover:decoration-[#212121] text-xl"
                :href="'mailto:' + lab.prof.email"
                >Prof. {{ lab.prof.name.join(" ") }}</a
              ><br />
            </p>
          </div>
        </div>
        <div class="py-4 text-left text-sm">{{ lab.description }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "assets/css/products.css";

.ul {
  list-style-type: square;
  list-style-position: inside;
}

li::marker {
  color: #ff0000;
}
</style>
