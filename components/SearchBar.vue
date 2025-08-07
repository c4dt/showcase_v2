<script setup lang="ts">
const searchQuery = defineModel<string>("searchQuery");
const searchInput = defineModel<HTMLInputElement | null>("searchInput");

const clearSearch = () => {
  searchQuery.value = "";
  searchInput.value?.focus();
};
</script>

<template>
  <div class="relative">
    <input
      ref="searchInput"
      v-model="searchQuery"
      type="text"
      class="w-full rounded-full bg-gray-200 py-2 pr-4 pl-10 text-gray-700 transition ring-inset focus:bg-white focus:ring-2 focus:ring-blue-300"
    />
    <svg
      class="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-500"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
    <!-- Clear Button -->
    <ClearButton
      v-if="searchQuery"
      :clear-func="clearSearch"
      aria-label="Clear search"
      class="absolute top-1/2 right-3 -translate-y-1/2 p-1"
    />
  </div>
</template>
