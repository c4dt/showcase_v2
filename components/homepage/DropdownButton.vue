<script setup lang="ts">
const isOpen = defineModel<boolean>({ default: false });
function toggleDropdown() {
  isOpen.value = !isOpen.value;
}
</script>
<template>
  <button
    class="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-500"
    aria-label="Toggle dropdown"
    @click="toggleDropdown"
  >
    <font-awesome :icon="['fas', 'caret-down']" />
  </button>
</template>
