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
  return props.itemList.filter((name) => name.toLowerCase().includes(query));
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
</script>

<template>
  <div class="dropdown-container relative py-2" @focusin="isOpen = true" @focusout="isOpen = false">
    <input
      v-model="searchQuery"
      type="text"
      :placeholder="title"
      class="w-full px-4 py-2 pr-8 border border-gray-300 rounded-md"
    />
    <!-- Clear Button -->
    <button
      v-if="selectedItem"
      class="absolute cursor-pointer inset-y-0 right-0 flex items-center pr-2"
      @click.prevent="clearSelection"
      aria-label="Clear selection"
    >
      <span class="w-6 h-6 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-md text-black">
        <font-awesome :icon="['fas', 'times']" class="w-3 h-3" />
      </span>
    </button>
    <!-- Dropdown Toggle Button -->
    <button
      v-if="!selectedItem"
      class="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-500"
      @click="toggleDropdown"
      aria-label="Toggle dropdown"
    >
      <font-awesome :icon="['fas', 'caret-down']" />
    </button>
    <!-- Dropdown List -->
    <ul
      v-if="isOpen && filteredList.length"
      class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
    >
      <li
        v-for="name in filteredList"
        :key="name"
        class="px-4 py-2 cursor-pointer hover:bg-gray-100"
        @mousedown.prevent="selectItem(name)"
      >
        {{ name }}
      </li>
    </ul>
    <!-- No Results Message -->
    <div
      v-else-if="isOpen && !filteredList.length"
      class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-4 text-gray-500"
    >
      No results found.
    </div>
  </div>
</template>
