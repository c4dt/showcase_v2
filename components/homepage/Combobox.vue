<script setup lang="ts">
const props = defineProps<{
  title: string;
  itemList: string[];
}>();

const selectedItem = defineModel<string>();
const searchQuery = ref<string>("");
const isOpen = ref<boolean>(false);

const filteredList = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return props.itemList.filter((name) => name.toLowerCase().includes(query)).sort();
});

function selectItem(name: string) {
  selectedItem.value = name;
  searchQuery.value = name; // Display the selected item
  isOpen.value = false;
}

function clearSelection() {
  selectedItem.value = "";
  searchQuery.value = "";
  isOpen.value = false;
}

defineExpose({
  clearSelection
});

function onFocusIn() {
  if (!selectedItem.value) {
    isOpen.value = true;
  }
}

const comboboxRef = useTemplateRef("combobox");
function onFocusOut(e: FocusEvent) {
  // only focus out if parent element looses focus
  if (!(e.relatedTarget && comboboxRef.value.contains(e.relatedTarget))) {
    isOpen.value = false;
  }
}
</script>

<template>
  <div ref="combobox" class="py-2" @focusout="onFocusOut">
    <div
      :class="[
        'w-full overflow-clip rounded-md border transition-colors duration-200',
        selectedItem ? 'cursor-default bg-gray-100 text-gray-500' : 'bg-white',
        'border-gray-300 focus-within:ring-2 focus-within:ring-blue-500',
        'justify-end-safe flex'
      ]"
    >
      <input
        v-model="searchQuery"
        type="text"
        :placeholder="title"
        :readonly="!!selectedItem"
        class="w-9/10 truncate py-2 pl-4 focus:outline-hidden"
        @focusin="onFocusIn"
      />
      <div class="w-1/10 overflow-clip py-2">
        <!-- Clear Button -->
        <HomepageClearButton v-if="selectedItem" :clear-func="clearSelection" aria-label="Clear selection" />
        <!-- Dropdown Toggle Button -->
        <HomepageDropdownButton v-if="!selectedItem" v-model="isOpen" />
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
