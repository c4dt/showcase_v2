<script setup lang="ts">
import { ref } from "vue";
const filteredOptions = ref<string[]>(["DEDIS", "DLAB", "LSIR"]);
const isOpen = ref(false);
function toggleDropdown() {
  isOpen.value = !isOpen.value;
}
defineProps<{
  title: string;
}>();
</script>

<template>
  <div class="relative py-2">
    <input type="text" :placeholder="title" class="w-full px-4 py-2 pr-8 border border-gray-300 rounded-md" />
    <button class="absolute right-0 px-2 py-2 text-gray-500 text-center" @click="toggleDropdown">
      <font-awesome :icon="['fa', 'caret-down']" />
    </button>
    <ul v-if="isOpen" class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
      <li v-for="name in filteredOptions" class="px-4 py-2 cursor-pointer hover:bg-gray-100">
        {{ name }}
      </li>
    </ul>
  </div>
</template>
