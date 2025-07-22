<script setup lang="ts">
const props = defineProps<{
  title: string;
  itemList: string[];
}>();

const selectedItems = defineModel<string[]>({ default: [] });
const searchQuery = ref<string>("");
const isOpen = ref<boolean>(false);

const filteredList = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return props.itemList
    .filter((name) => name.toLowerCase().includes(query) && !selectedItems.value.includes(name))
    .sort();
});

function selectItem(name: string) {
  selectedItems.value = [...selectedItems.value, name];
  searchQuery.value = "";
}

function removeItem(name: string) {
  const updatedItems = selectedItems.value.filter((item) => item !== name);
  if (!updatedItems.length) {
    isOpen.value = false;
  }
  selectedItems.value = updatedItems;
}

function clearAll() {
  selectedItems.value = [];
  searchQuery.value = "";
}

function onFocusIn() {
  isOpen.value = true;
}

const multiSelectComboboxRef = useTemplateRef("multiSelectCombobox");
function onFocusOut(e: FocusEvent) {
  // only close drop-down list if parent element looses focus
  if (!(e.relatedTarget && multiSelectComboboxRef.value.contains(e.relatedTarget))) {
    isOpen.value = false;
  }
}

defineExpose({ clearAll });
</script>

<template>
  <div ref="multiSelectCombobox" class="py-2" @focusout="onFocusOut">
    <div
      class="justify-end-safe flex w-full overflow-clip rounded-md border border-gray-300 bg-white focus-within:ring-2 focus-within:ring-blue-500"
    >
      <!-- flex-wrap tags w/ input -->
      <!-- make `div` focusable to open drop-down list when clicking on list of tabs but don't add it to tab index order -->
      <div class="flex w-9/10 flex-wrap overflow-clip py-2 pl-4" tabindex="-1" @focusin="onFocusIn">
        <!-- flex-wrap tags w/ each other -->
        <div class="flex flex-wrap items-center gap-1 truncate">
          <!-- Selected items as pills -->
          <span v-for="item in selectedItems" :key="item" class="epfl-tag-light-removable max-w-full overflow-clip">
            <span class="truncate pr-2">
              {{ item }}
            </span>
            <button aria-label="Remove item" class="epfl-times overflow-clip" @click.stop="removeItem(item)">
              <font-awesome :icon="['fas', 'times']" />
            </button>
          </span>
        </div>
        <!-- Input field -->
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="selectedItems.length ? '' : title"
          class="border-none focus:outline-none"
        />
      </div>
      <div :class="selectedItems.length ? 'flex w-2/10 flex-wrap justify-evenly' : '' + ' py-2'">
        <HomepageClearButton v-if="selectedItems.length" :clear-func="clearAll" aria-label="Clear all selections" />
        <HomepageDropdownButton v-model="isOpen" />
      </div>
    </div>
    <HomepageDropdownList
      v-if="isOpen && filteredList.length"
      :select-func="selectItem"
      :filtered-list="filteredList"
    />
    <HomepageNoResultsMessage v-else-if="isOpen && !filteredList.length" />
  </div>
</template>
