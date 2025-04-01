<template>
  <div>
    <div v-for="tag in statusTags" :key="tag" class="flex justify-end pb-2 px-4">
      <div class="cursor-help" :title="tag.title">
        {{ tag.label }}
      </div>
    </div>
    <div class="flex justify-end pb-2 px-4">
      <span>Maturity: </span
      ><span
        v-for="(val, idx) in pprintMaturity"
        :key="val"
        :title="title[idx]"
        :class="`${grayscale[idx]} cursor-help`"
        >{{ val }}</span
      >
    </div>
  </div>
</template>
<script lang="ts" setup>
const props = defineProps<{
  project: ExtendedProject;
}>();
const statusTags: { title: string; label: string }[] = [];
const statusColors = {
  [PROJECT_C4DT_STATUS.ACTIVE]: "\u{1F7E2}",
  [PROJECT_C4DT_STATUS.RETIRED]: "\u{1F7E0}",
  [PROJECT_LAB_STATUS.ACTIVE]: "\u{1F7E2}"
};
if (props.project.c4dt_status) {
  statusTags.push({
    title: props.project.c4dt_status,
    label: `${PROJECT_STATUS_DESC.C4DT_STATUS} ${statusColors[props.project.c4dt_status]}`
  });
}
if (props.project.lab_status) {
  statusTags.push({
    title: props.project.lab_status,
    label: `${PROJECT_STATUS_DESC.LAB_STATUS} ${statusColors[props.project.lab_status]}`
  });
}
const maturity = props.project.maturity ?? 0;
const title = ["Evaluation upon request", "Prototype", "Intermediate", "Mature"];
const pprintMaturity = ["\u{2753}", "\u{1f95a}", "\u{1f425}", "\u{1f414}"];
const grayscale = pprintMaturity.map((val, idx) =>
  (idx > 0 && idx <= maturity) || (idx === 0 && maturity === 0) ? "" : "grayscale-100"
);
</script>
