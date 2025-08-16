<script setup lang="ts">
const props = defineProps<{
  title: string;
  itemList: string[];
}>();

const selectedItems = defineModel<string[]>({ default: [] });
const searchQuery = ref<string>("");
const isOpen = ref<boolean>(false);

// filter and sort items
const filteredList = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return props.itemList
    .filter((name) => name.toLowerCase().includes(query) && !selectedItems.value.includes(name)) // filter by search query and exclude selected items
    .sort();
});

// add item to selection
function selectItem(name: string) {
  selectedItems.value = [...selectedItems.value, name];
  searchQuery.value = ""; // clear search input after adding item
}

// remove item from selection
function removeItem(name: string) {
  const updatedItems = selectedItems.value.filter((item) => item !== name);
  if (!updatedItems.length) {
    isOpen.value = false; // close drop-down menu if no items are left
  }
  selectedItems.value = updatedItems;
}

// clear all selected items and clear search input
function clearAll() {
  selectedItems.value = [];
  searchQuery.value = "";
  isOpen.value = false;
}

// open drop-down menu
function onFocusIn() {
  isOpen.value = true;
}

const multiSelectComboboxRef = useTemplateRef("multiSelectCombobox");

// close drop-down (only if parent element loses focus)
function onFocusOut(e: FocusEvent) {
  if (!(e.relatedTarget && multiSelectComboboxRef.value.contains(e.relatedTarget))) {
    isOpen.value = false;
  }
}

defineExpose({ clearAll });
</script>

<template>
  <label :for="`searchInput${title}`">Filter by {{ title.toLowerCase() }}</label>
  <div ref="multiSelectCombobox" class="py-2" @focusout="onFocusOut">
    <div class="justify-end-safe epfl-input flex">
      <div class="flex w-9/10 flex-wrap overflow-clip py-2 pl-4" tabindex="-1" @focusin="onFocusIn">
        <div class="flex flex-wrap items-center gap-1 truncate">
          <span v-for="item in selectedItems" :key="item" class="epfl-tag-light-removable max-w-full overflow-clip">
            <span class="truncate pr-2">
              {{ item }}
            </span>
            <button aria-label="Remove item" class="epfl-times overflow-clip" @click.stop="removeItem(item)">
              <font-awesome :icon="['fas', 'times']" />
            </button>
          </span>
        </div>
        <input
          :id="`searchInput${title}`"
          v-model="searchQuery"
          type="text"
          :placeholder="selectedItems.length ? '' : title"
          class="border-none focus:outline-none"
        />
      </div>
      <div :class="selectedItems.length ? 'flex w-2/10 flex-wrap justify-evenly' : '' + ' py-2'">
        <ClearButton v-if="selectedItems.length" :clear-func="clearAll" aria-label="Clear all selections" />
        <HomepageDropdownButton v-model="isOpen" />
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
