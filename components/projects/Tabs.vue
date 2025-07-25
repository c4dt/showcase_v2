<template>
  <div class="flex py-4">
    <ul class="flex-[2] list-none px-4 text-left">
      <li
        v-if="project.incubator"
        :class="[
          'w-full cursor-pointer border-r px-4 py-2 text-left text-gray-800',
          activeTab === TAB_IDS.INCUBATOR ? 'border-r-2 border-red-500 bg-gray-200' : 'border-gray-200 bg-white'
        ]"
        @click="changeTab(TAB_IDS.INCUBATOR)"
      >
        C4DT work
      </li>
      <li
        :class="[
          'w-full cursor-pointer border-r px-4 py-2 text-left text-gray-800',
          activeTab === TAB_IDS.TECHNICAL ? 'border-r-2 border-red-500 bg-gray-200' : 'border-gray-200 bg-white'
        ]"
        @click="changeTab(TAB_IDS.TECHNICAL)"
      >
        Technical
      </li>
      <li
        v-if="papers.length"
        :class="[
          'w-full cursor-pointer border-r px-4 py-2 text-left text-gray-800',
          activeTab === TAB_IDS.PAPERS ? 'border-r-2 border-red-500 bg-gray-200' : 'border-gray-200 bg-white'
        ]"
        @click="changeTab(TAB_IDS.PAPERS)"
      >
        Research papers
      </li>
      <li
        v-if="articles.length"
        :class="[
          'w-full cursor-pointer border-r px-4 py-2 text-left text-gray-800',
          activeTab === TAB_IDS.ARTICLES ? 'border-r-2 border-red-500 bg-gray-200' : 'border-gray-200 bg-white'
        ]"
        @click="changeTab(TAB_IDS.ARTICLES)"
      >
        Miscellaneous publications
      </li>
      <li
        v-for="tab in additionalTabs"
        :key="tab"
        :class="[
          'w-full cursor-pointer border-r px-4 py-2 text-left text-gray-800',
          activeTab === tab.id ? 'border-r-2 border-red-500 bg-gray-200' : 'border-gray-200 bg-white'
        ]"
        @click="changeTab(tab.id)"
      >
        {{ tab.label }}
      </li>
    </ul>
    <div class="flex-[10] px-4">
      <ProjectsIncubatorTab v-if="project.incubator && activeTab === TAB_IDS.INCUBATOR" :project="project" />
      <ProjectsPapersTab v-if="papers.length && activeTab === TAB_IDS.PAPERS" :papers="papers" />
      <ProjectsArticlesTab v-if="articles.length && activeTab === TAB_IDS.ARTICLES" :articles="articles" />
      <ProjectsTechnicalTab v-if="project.code && activeTab === TAB_IDS.TECHNICAL" :project="project" />
      <div v-for="tab in additionalTabs" :key="tab" class="flex py-2 text-left">
        <div v-if="activeTab === tab.id" v-html="tab.content" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  project: ExtendedProject;
}>();
const project = props.project;
const papers = project.information
  ? project.information.filter((information) => information.type.toLowerCase() === "paper")
  : [];
const articles = project.information
  ? project.information.filter((information) => information.type.toLowerCase() === "article")
  : [];
const additionalTabs = useState<ProjectTab[]>(`project-${useRoute().params.id}-tabs`).value;
const router = useRouter();

const activeTab = ref();

const changeTab = (tabId: string) => {
  router.replace({ query: { section: tabId } });
  activeTab.value = tabId;
};

const tabIds = [
  ...(project.incubator ? [TAB_IDS.INCUBATOR] : []),
  ...(project.code ? [TAB_IDS.TECHNICAL] : []),
  ...(papers.length ? [TAB_IDS.PAPERS] : []),
  ...(articles.length ? [TAB_IDS.ARTICLES] : []),
  ...additionalTabs.map((tab) => tab.id)
];

function setDefaultTab() {
  const route = useRoute();
  const tabFromQuery = route.query?.section as string;
  if (tabIds.some((id) => id === tabFromQuery)) {
    changeTab(tabFromQuery);
  } else if (tabIds.length >= 1) {
    changeTab(tabIds[0]);
  }
}
if (!activeTab.value) {
  setDefaultTab();
}
</script>
