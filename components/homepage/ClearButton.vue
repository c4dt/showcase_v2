<script setup lang="ts">
interface ClearFunc {
  (): void;
}
defineProps<{
  clearFunc: ClearFunc;
}>();
</script>

<template>
  <button
    class="absolute inset-y-0 right-6 flex items-center"
    aria-label="Clear all selections"
    @click.prevent="clearFunc"
  >
    <span class="epfl-times">
      <font-awesome :icon="['fas', 'times']" class="h-3 w-3" />
    </span>
  </button>
</template>
