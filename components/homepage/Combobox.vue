<script setup lang="ts">
const isOpen = ref(false);
function toggleDropdown() {
  if (isOpen.value) {
    isOpen.value = false;
  } else {
    isOpen.value = true;
    fieldValue.value = "";
  }
}
const props = defineProps<{
  title: string;
  itemList: string[];
}>();

const fieldValue = ref("");

const filteredList = computed(() => {
  return props.itemList.filter((name) => name.toLowerCase().includes(fieldValue.value.toLowerCase()));
});

function selectItem(name: string) {
  fieldValue.value = name;
  isOpen.value = false;
}
</script>

<template>
  <div class="dropdown-container relative py-2">
    <input
      type="text"
      v-model="fieldValue"
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
        @click="selectItem(name)"
        class="px-4 py-2 cursor-pointer hover:bg-gray-100"
      >
        {{ name }}
      </li>
    </ul>
  </div>
</template>
