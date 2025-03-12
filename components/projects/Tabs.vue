<template>
  <div class="py-4 flex">
    <div class="flex-[2] px-4 text-left">
      <ul class="ul">
        <li v-for="tab in tabs">
          <div
              :class="{
                'bg-[#e6e6e6] px-4 py-2 text-[#212121] border-r-[#ff0000] border-r-solid border-r-2': activeTab === tab.id,
                'bg-[#ffffff] px-4 py-2 text-[#212121] border-r-[#e6e6e6] border-r-solid border-r-1': activeTab !== tab.id
              }"
          >
            <button
              @click="useRouter().replace({ hash: `#${tab.id}` })"
            >
              {{ tab.label }}
            </button>
          </div>
        </li>
      </ul>
    </div>
    <div class="flex-[8] text-left py-2 bg-[#ffffff]">
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

<style scoped>

.ul {
  list-style: none;
}
</style>
