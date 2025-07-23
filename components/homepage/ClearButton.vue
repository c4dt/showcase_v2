<script setup lang="ts">
interface ClearFunc {
  (): void;
}
defineProps<{
  clearFunc: ClearFunc;
}>();
</script>

<template>
  <button aria-label="Clear all selections" @click.prevent="clearFunc">
    <span class="epfl-times">
      <font-awesome :icon="['fas', 'times']" class="h-3 w-3" />
    </span>
  </button>
</template>
