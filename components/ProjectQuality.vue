<template>
  <div>
    <div v-for="tag in statusTags" :key="tag" class="flex justify-end pb-2 px-4">
      <div class="px-4">
        {{ tag.desc }}
        <span :class="`px-3 py-1 rounded-full text-sm font-semibold text-white ${tag.color} shadow-lg`">
          {{ tag.label }}
        </span>
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
const statusTags = ref<{ label: string; color: string }[]>([]);
const statusColor = {
  [PROJECT_STATUS.C4DT_SUPPORT_ACTIVE]: "bg-green-500",
  [PROJECT_STATUS.C4DT_SUPPORT_RETIRED]: "bg-orange-500",
  [PROJECT_STATUS.LAB_MAINTENANCE_ACTIVE]: "bg-green-500"
};
if (props.project.c4dt_status) {
  statusTags.value.push({
    desc: PROJECT_STATUS_DESC.C4DT_STATUS,
    label: props.project.c4dt_status,
    color: statusColor[props.project.c4dt_status]
  });
}
if (props.project.lab_status) {
  statusTags.value.push({
    desc: PROJECT_STATUS_DESC.LAB_STATUS,
    label: props.project.lab_status,
    color: statusColor[props.project.lab_status]
  });
}
const maturity = props.project.maturity ? props.project.maturity : 0;
const title = ["Evaluation upon request", "Prototype", "Intermediate", "Mature"];
const pprintMaturity = ["\u{2753}", "\u{1f95a}", "\u{1f425}", "\u{1f414}"];
const grayscale = pprintMaturity.map((val, idx) =>
  (idx > 0 && idx <= maturity) || (idx === 0 && maturity === 0) ? "" : "grayscale-100"
);
</script>
