<template>
  <div class="py-4">
    <div class="flex">
      <button
        v-for="tab in tabs"
        :class="{
          'bg-[#ff0000] px-4 py-2 text-[#e6e6e6] border-b-[#ff0000] border-b-solid border-b-2': activeTab === tab.id,
          'bg-[#ffffff] px-4 py-2 text-[#212121] border-b-[#ff0000] border-b-solid border-b-2': activeTab !== tab.id
        }"
        @click="useRouter().replace({ hash: `#${tab.id}` })"
      >
        {{ tab.label }}
      </button>
    </div>
    <div class="text-left py-2 bg-[#ffffff]">
      <div v-html="tabs.find((tab) => tab.id === activeTab).content" />
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
  defaultTab: string;
}>();
const tabIds = props.tabs.map((tab) => {
  return tab.id;
});
const route = useRoute();
const currTab = route.hash.slice(1);
const activeTab = ref(tabIds.includes(currTab) ? currTab : props.defaultTab);
watch(
  () => route.hash,
  (hash) => {
    const tabId = hash.slice(1);
    if (tabIds.includes(tabId)) {
      activeTab.value = tabId;
    }
  }
);
</script>
