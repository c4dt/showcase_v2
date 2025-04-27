<template>
  <ul class="ul">
    <li v-for="paper in papers" :key="paper">
      <a
        class="underline text-[#212121] hover:text-[#ff0000] decoration-[#ff0000] hover:decoration-[#212121]"
        :href="paper.url"
        >{{ paper.title }}</a
      >
    </li>
  </ul>
</template>
<script lang="ts" setup>
defineProps<{
  papers: [];
}>();
</script>
