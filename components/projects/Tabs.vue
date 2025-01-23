<template>
  <div class="container">
    <div class="header">
      <button
        v-for="tab in tabs"
        :class="{ 'tab': true, active: activeTab === tab.id }"
        @click="useRouter().replace({ hash: `#${tab.id}` })"
      >
        {{ tab.label }}
      </button>
    </div>
    <div class="content">
      <div v-html="tabs.find((tab) => tab.id === activeTab).content"></div>
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
  const tabIds = props.tabs.map((tab) => { return tab.id });
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
.container {
  @apply py-4
}

.header {
  @apply flex
}

.tab {
  @apply bg-[#ff0000] px-4 py-2 text-[#e6e6e6]
}

.active {
  @apply bg-[#ffffff] rounded-t-xl text-[#212121] border-b-[#ff0000] border-solid border-b-2
}

.content {
  @apply text-left py-2 bg-[#ffffff]
}
</style>
