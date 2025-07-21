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
</script>

<template>
  <div class="relative py-2" @focusout="onFocusOut">
    <div
      :class="[
        'w-full overflow-clip rounded-md border transition-colors duration-200',
        selectedItem ? 'cursor-default bg-gray-100 text-gray-500' : 'bg-white',
        'border-gray-300 focus-within:ring-2 focus-within:ring-blue-500'
      ]"
      @focusin="onFocusIn"
    >
      <div>
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="title"
          :readonly="!!selectedItem"
          class="truncate px-4 py-2 pr-12 focus:outline-hidden"
        />
      </div>
      <!-- Clear Button -->
      <button
        v-if="selectedItem"
        class="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-2"
        aria-label="Clear selection"
        @click.prevent="clearSelection"
      >
        <span class="epfl-times">
          <font-awesome :icon="['fas', 'times']" />
        </span>
      </button>
      <!-- Dropdown Toggle Button -->
      <HomepageDropdownButton v-if="!selectedItem" v-model="isOpen" />
    </div>
    <HomepageDropdownList
      v-if="isOpen && filteredList.length"
      :select-func="selectItem"
      :filtered-list="filteredList"
    />
    <HomepageNoResultsMessage v-else-if="isOpen && !filteredList.length" />
  </div>
</template>
