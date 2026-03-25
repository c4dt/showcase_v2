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
    <!-- list to display filtered options -->
    <ul class="epfl-select">
      <!-- eslint-disable vue/no-v-html -- We trust the html because it's our hard-coded data -->
      <li
        v-for="name in filteredList"
        :key="name"
        class="epfl-option"
        @mousedown.prevent="selectFunc(name)"
        v-html="name"
      />
      <!-- eslint-enable vue/no-v-html -->
    </ul>
  </div>
</template>

<style scoped>
ul {
  list-style: none;
}
</style>
