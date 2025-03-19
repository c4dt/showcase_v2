<template>
  <div class="flex py-4">
    <ul class="flex-[2] px-4 text-left list-none">
      <li
        v-for="tab in tabs"
        :key="tab.id"
        :class="[
          'w-full text-left px-4 py-2 border-r text-gray-800',
          activeTab === tab.id ? 'bg-gray-200  border-red-500 border-r-2' : 'bg-white border-gray-200'
        ]"
        @click="changeTab(tab.id)"
      >
        {{ tab.label }}
      </li>
    </ul>
    <div class="flex-[10] px-4">
      <div v-for="tab in tabs" :id="tab.id" :key="tab.id" class="flex py-2 text-left bg-white">
        <div v-if="tab.id == activeTab" v-html="tab.content" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  tabs: {
    id: string;
    label: string;
    content: string;
  }[];
}>();
const route = useRoute();
const router = useRouter();

const activeTab = ref();

const changeTab = (tabId: string) => {
  router.push({ query: { section: tabId } });
  activeTab.value = tabId;
};

function setDefaultTab() {
  // sets the active to a default that is dervied from
  // either the url hash or the first tab in the list
  const tabFromQuery = route.query?.section as string;
  if (props.tabs.some((tab) => tab.id === tabFromQuery)) {
    changeTab(tabFromQuery);
  } else {
    changeTab(props.tabs[0].id); // first tab in the list
  }
}
if (!activeTab.value) {
  setDefaultTab();
}
</script>
