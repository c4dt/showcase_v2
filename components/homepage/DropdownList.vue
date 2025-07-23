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
    <ul class="epfl-select">
      <li
        v-for="name in filteredList"
        :key="name"
        class="epfl-option"
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
