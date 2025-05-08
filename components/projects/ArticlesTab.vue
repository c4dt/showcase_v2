<template>
  <div>
    <ul class="ul">
      <li v-for="article in articles" :key="article">
        <a class="epfl-a" :href="article.url">{{ article.title }}</a>
      </li>
    </ul>
  </div>
</template>
<script lang="ts" setup>
defineProps<{
  articles: [];
}>();
</script>
