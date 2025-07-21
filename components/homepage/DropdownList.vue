<script setup lang="ts">
interface SelectFunc {
  (name: string): void;
}
defineProps<{
  selectFunc: SelectFunc;
  filteredList: string[];
}>();
</script>
<template>
  <div>
    <ul class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-300 bg-white shadow-lg">
      <li
        v-for="name in filteredList"
        :key="name"
        class="cursor-pointer truncate px-4 py-2 hover:bg-gray-100"
        :title="name"
        @mousedown.prevent="selectFunc(name)"
      >
        {{ name }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
ul {
  list-style: none;
}
</style>
