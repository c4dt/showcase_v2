<script setup lang="ts">
const selectedItem = defineModel<string>();
const isOpen = ref(false);
const fieldDisplayValue = ref("");

function toggleDropdown() {
  if (isOpen.value) {
    isOpen.value = false;
  } else {
    isOpen.value = true;
    fieldDisplayValue.value = "";
    selectedItem.value = "";
  }
}
const props = defineProps<{
  title: string;
  itemList: string[];
}>();

const filteredList = computed(() => {
  return props.itemList.filter((name) => name.toLowerCase().includes(fieldDisplayValue.value.toLowerCase()));
});

function selectItem(name: string) {
  fieldDisplayValue.value = name;
  selectedItem.value = name;
  isOpen.value = false;
}
</script>

<template>
  <div class="dropdown-container relative py-2">
    <input
      v-model="fieldDisplayValue"
      type="text"
      :placeholder="title"
      class="w-full px-4 py-2 pr-8 border border-gray-300 rounded-md"
      @focusin="isOpen = true"
    />
    <button class="absolute right-0 px-2 py-2 text-gray-500 text-center" @click="toggleDropdown">
      <font-awesome :icon="['fa', 'caret-down']" />
    </button>
    <ul v-if="isOpen" class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
      <li
        v-for="name in filteredList"
        :key="name"
        class="px-4 py-2 cursor-pointer hover:bg-gray-100"
        @click="selectItem(name)"
      >
        {{ name }}
      </li>
    </ul>
  </div>
</template>
