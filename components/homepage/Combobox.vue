<script setup lang="ts">
const props = defineProps<{
  title: string;
  itemList: string[];
}>();

const selectedItem = defineModel<string>();
const searchQuery = ref<string>("");
const isOpen = ref<boolean>(false);

// filter and sort items
const filteredList = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return props.itemList.filter((name) => name.toLowerCase().includes(query)).sort();
});

// handle item selection
function selectItem(name: string) {
  selectedItem.value = name;
  searchQuery.value = name; // display the selected item
  isOpen.value = false;
}

// clear selected item and search query, and close drop-down menu
function clearSelection() {
  selectedItem.value = "";
  searchQuery.value = "";
  isOpen.value = false;
}

defineExpose({
  clearSelection
});

// open drop-down menu
function onFocusIn() {
  if (!selectedItem.value) {
    isOpen.value = true;
  }
}

const comboboxRef = useTemplateRef("combobox");

// close drop-down menu (only if parent element loses focus)
function onFocusOut(e: FocusEvent) {
  if (!(e.relatedTarget && comboboxRef.value.contains(e.relatedTarget))) {
    isOpen.value = false;
  }
}
</script>

<template>
  <label :for="`searchInput${title}`">Filter by {{ title.toLowerCase() }}</label>
  <div ref="combobox" class="py-2" @focusout="onFocusOut">
    <div class="epfl-input justify-end-safe flex">
      <input
        :id="`searchInput${title}`"
        v-model="searchQuery"
        type="text"
        :placeholder="title"
        :readonly="!!selectedItem"
        class="w-9/10 truncate py-2 pl-4 focus:outline-hidden"
        @focusin="onFocusIn"
      />
      <div class="w-1/10 overflow-clip py-2">
        <HomepageClearButton v-if="selectedItem" :clear-func="clearSelection" aria-label="Clear selection" />
        <HomepageDropdownButton v-if="!selectedItem" v-model="isOpen" />
      </div>
    </div>
    <!-- drop-down menu if filtered list is not empty -->
    <HomepageDropdownList
      v-if="isOpen && filteredList.length"
      :select-func="selectItem"
      :filtered-list="filteredList"
    />
    <!-- 'No results found.' message if no items match search criteria -->
    <HomepageNoResultsMessage v-else-if="isOpen && !filteredList.length" />
  </div>
</template>
