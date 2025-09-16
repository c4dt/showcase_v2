<script setup lang="ts">
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { nextTick } from "vue";
const searchQuery = defineModel<string>("searchQuery");
const searchInput = defineModel<HTMLInputElement | null>("searchInput");
const { search, toggleSearch } = useSearch();

const clearSearch = () => {
  searchQuery.value = "";
  searchInput.value?.focus();
};
const toggleAndFocus = async () => {
  toggleSearch();
  await nextTick(); // wait for DOM update
  searchInput.value?.focus();
};
</script>

<template>
  <!-- use fixed-height container to maintain positioning of other elements when input is toggled off -->
  <div class="flex h-10">
    <button aria-label="Toggle search bar open/closed" @click="toggleAndFocus">
      <FontAwesomeIcon :icon="faMagnifyingGlass" class="pr-2 hover:text-[#ff0000]" />
    </button>
    <div v-show="search" class="epfl-input flex items-center px-2">
      <input ref="searchInput" v-model="searchQuery" type="text" class="w-full focus:outline-none" />
      <!-- Clear Button -->
      <ClearButton v-if="searchQuery" :clear-func="clearSearch" aria-label="Clear search" class="" />
    </div>
  </div>
</template>
