<template>
  <ul class="ul">
    <li v-for="paper in papers" :key="paper">
      <a class="epfl-a" :href="paper.url">{{ paper.title }}</a>
    </li>
  </ul>
</template>
<script lang="ts" setup>
defineProps<{
  papers: [];
}>();
</script>
