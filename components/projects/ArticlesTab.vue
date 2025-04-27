<template>
  <div>
    <ul class="ul">
      <li v-for="article in articles" :key="article">
        <a
          class="underline text-[#212121] hover:text-[#ff0000] decoration-[#ff0000] hover:decoration-[#212121]"
          :href="article.url"
          >{{ article.title }}</a
        >
      </li>
    </ul>
  </div>
</template>
<script lang="ts" setup>
defineProps<{
  articles: [];
}>();
</script>
