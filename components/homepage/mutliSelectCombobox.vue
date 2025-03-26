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
  selectedItems.value = selectedItems.value.filter((item) => item !== name);
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
      class="flex flex-wrap gap-1 items-center w-full px-4 py-2 pr-12 border rounded-md bg-white border-gray-300 focus-within:ring-2 focus-within:ring-blue-500 min-h-[40px]"
      @focusin="onFocusIn"
    >
      <!-- Selected items as pills -->
      <span
        v-for="item in selectedItems"
        :key="item"
        class="inline-flex items-center px-2 py-1 rounded bg-blue-100 text-blue-700 text-sm"
      >
        {{ item }}
        <button aria-label="Remove item" class="ml-1 text-blue-500 hover:text-blue-700" @click.stop="removeItem(item)">
          <font-awesome :icon="['fas', 'times']" class="w-3 h-3" />
        </button>
      </span>
      <!-- Input field -->
      <input
        v-model="searchQuery"
        type="text"
        :placeholder="selectedItems.length ? '' : title"
        class="flex-grow border-none focus:outline-none min-w-[120px]"
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
      <span class="w-6 h-6 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded text-black">
        <font-awesome :icon="['fas', 'times']" class="w-3 h-3" />
      </span>
    </button>
    <ul
      v-if="isOpen && filteredList.length"
      class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
    >
      <li
        v-for="name in filteredList"
        :key="name"
        class="px-4 py-2 cursor-pointer hover:bg-gray-100 truncate"
        :title="name"
        @mousedown.prevent="selectItem(name)"
      >
        {{ name }}
      </li>
    </ul>

    <div
      v-else-if="isOpen && !filteredList.length"
      class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-4 text-gray-500"
    >
      No results found.
    </div>
  </div>
</template>
