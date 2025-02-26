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
    <button class="absolute right-0 px-2 py-2 text-gray-500 text-center" @click="isOpen = !isOpen">
      <font-awesome :icon="['fa', 'caret-down']" />
    </button>
    <ul v-if="isOpen" class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
      <li
        v-for="name in filteredList"
        :key="name"
        class="px-4 py-2 cursor-pointer hover:bg-gray-100"
        @mousedown.prevent="selectItem(name)"
      >
        {{ name }}
      </li>
    </ul>
  </div>
</template>
