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

function onFocusOut() {
  isOpen.value = false;
}

function toggleDropdown() {
  if (!selectedItem.value) {
    isOpen.value = !isOpen.value;
  }
}
</script>

<template>
  <div class="relative py-2" @focusout="onFocusOut">
    <div @focusin="onFocusIn">
      <input
        v-model="searchQuery"
        type="text"
        :placeholder="title"
        :readonly="!!selectedItem"
        :class="[
          'w-full rounded-md border px-4 py-2 pr-12 transition-colors duration-200',
          selectedItem ? 'cursor-default bg-gray-100 text-gray-500' : 'bg-white',
          'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-hidden'
        ]"
      />
    </div>
    <!-- Clear Button -->
    <button
      v-if="selectedItem"
      class="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-2"
      aria-label="Clear selection"
      @click.prevent="clearSelection"
    >
      <span class="flex h-6 w-6 items-center justify-center rounded-md bg-gray-200 text-black hover:bg-gray-300">
        <font-awesome :icon="['fas', 'times']" class="h-3 w-3" />
      </span>
    </button>
    <!-- Dropdown Toggle Button -->
    <button
      v-if="!selectedItem"
      class="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-500"
      aria-label="Toggle dropdown"
      @click="toggleDropdown"
    >
      <font-awesome :icon="['fas', 'caret-down']" />
    </button>
    <!-- Dropdown List -->
    <ul
      v-if="isOpen && filteredList.length"
      class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-300 bg-white shadow-lg"
    >
      <li
        v-for="name in filteredList"
        :key="name"
        class="cursor-pointer truncate px-4 py-2 hover:bg-gray-100"
        :title="name"
        @mousedown.prevent="selectItem(name)"
      >
        {{ name }}
      </li>
    </ul>
    <!-- No Results Message -->
    <div
      v-else-if="isOpen && !filteredList.length"
      class="absolute z-10 mt-1 w-full rounded-md border border-gray-300 bg-white p-4 text-gray-500 shadow-lg"
    >
      No results found.
    </div>
  </div>
</template>

<style scoped>
ul {
  list-style: none;
}
</style>
