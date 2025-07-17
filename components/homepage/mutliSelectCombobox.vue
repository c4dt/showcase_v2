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

function toggleDropdown() {
  isOpen.value = !isOpen.value;
}

function onFocusIn() {
  isOpen.value = true;
}

function onFocusOut() {
  // Short timeout prevents immediate close on item click
  setTimeout(() => (isOpen.value = false), 150);
}

defineExpose({ clearAll });
</script>

<template>
  <div class="relative py-2" @focusout="onFocusOut">
    <div
      class="flex min-h-[40px] w-full flex-wrap items-center gap-1 rounded-md border border-gray-300 bg-white px-4 py-2 pr-12 focus-within:ring-2 focus-within:ring-blue-500"
      @focusin="onFocusIn"
    >
      <!-- Selected items as pills -->
      <span v-for="item in selectedItems" :key="item" class="epfl-tag-light-removable max-w-full">
        <span class="truncate pr-2">
          {{ item }}
        </span>
        <button aria-label="Remove item" class="epfl-times truncate" @click.stop="removeItem(item)">
          <font-awesome :icon="['fas', 'times']" />
        </button>
      </span>
      <!-- Input field -->
      <input
        v-model="searchQuery"
        type="text"
        :placeholder="selectedItems.length ? '' : title"
        class="min-w-[120px] flex-grow border-none focus:outline-none"
      />
    </div>
    <button
      class="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-500"
      aria-label="Toggle dropdown"
      @click.prevent="toggleDropdown"
    >
      <font-awesome :icon="['fas', 'caret-down']" />
    </button>
    <button
      v-if="selectedItems.length"
      class="absolute inset-y-0 right-6 flex items-center"
      aria-label="Clear all selections"
      @click.prevent="clearAll"
    >
      <span class="epfl-times">
        <font-awesome :icon="['fas', 'times']" class="h-3 w-3" />
      </span>
    </button>
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
