<script setup lang="ts">
const isOpen = defineModel<boolean>({ default: false });
function toggleDropdown() {
  isOpen.value = !isOpen.value;
}
</script>
<template>
  <button class="text-gray-500" aria-label="Toggle dropdown" @click="toggleDropdown">
    <font-awesome :icon="['fas', 'caret-down']" />
  </button>
</template>
