<template>
  <div>
    <span>Maturity: </span
    ><span
      v-for="(val, idx) in pprintMaturity"
      :key="val"
      :title="title[idx]"
      :class="`${grayscale[idx]} cursor-help`"
      >{{ val }}</span
    >
  </div>
</template>
<script lang="ts" setup>
const props = defineProps<{ maturity: int }>();
const title = ["Evaluation upon request", "Prototype", "Intermediate", "Mature"];
const pprintMaturity = ["\u{2753}", "\u{1f95a}", "\u{1f425}", "\u{1f414}"];
const grayscale = pprintMaturity.map((val, idx) => (idx === props.maturity ? "" : "grayscale-100"));
</script>
