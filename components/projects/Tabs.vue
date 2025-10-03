<template>
  <div class="flex flex-col lg:flex-row">
    <ul class="flex list-none flex-row flex-wrap text-left lg:flex-[2] lg:flex-col lg:pr-4">
      <li
        v-if="project.incubator"
        :class="[tabBaseClass, activeTab === TAB_IDS.INCUBATOR ? tabActiveClass : tabInactiveClass]"
        @click="changeTab(TAB_IDS.INCUBATOR)"
      >
        C4DT work
      </li>
      <li
        v-if="project.code"
        :class="[tabBaseClass, activeTab === TAB_IDS.TECHNICAL ? tabActiveClass : tabInactiveClass]"
        @click="changeTab(TAB_IDS.TECHNICAL)"
      >
        Technical
      </li>
      <li
        v-if="papers.length"
        :class="[tabBaseClass, activeTab === TAB_IDS.PAPERS ? tabActiveClass : tabInactiveClass]"
        @click="changeTab(TAB_IDS.PAPERS)"
      >
        Research papers
      </li>
      <li
        v-if="articles.length"
        :class="[tabBaseClass, activeTab === TAB_IDS.ARTICLES ? tabActiveClass : tabInactiveClass]"
        @click="changeTab(TAB_IDS.ARTICLES)"
      >
        Miscellaneous publications
      </li>
      <li
        v-for="tab in additionalTabs"
        :key="tab"
        :class="[tabBaseClass, activeTab === tab.id ? tabActiveClass : tabInactiveClass]"
        @click="changeTab(tab.id)"
      >
        {{ tab.label }}
      </li>
    </ul>
    <div class="lg:flex-[10]">
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

const tabBaseClass =
  "flex-1 text-nowrap max-w-1/2 lg:max-w-none lg:flex-0 lg:w-full cursor-pointer border-b lg:border-r lg:border-b-0 px-4 py-2 text-left text-gray-800";
const tabActiveClass = "border-b-2 lg:border-b-0 lg:border-r-2 border-red-500 bg-gray-200";
const tabInactiveClass = "border-gray-200 bg-white";

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
