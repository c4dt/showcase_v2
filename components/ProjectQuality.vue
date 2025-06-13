<template>
  <div>
    <div v-for="tag in statusTags" :key="tag" class="flex">
      <div class="cursor-help" :title="tag.title">
        {{ tag.label }}
      </div>
    </div>
    <div class="flex">
      <div v-if="maturity">
        <span>Maturity: </span
        ><span
          v-for="(val, idx) in pprintMaturity"
          :key="val"
          :title="title[idx]"
          :class="`${grayscale[idx]} cursor-help`"
          >{{ val }}</span
        >
      </div>
      <div v-if="maturity === 0">
        <span>Request maturity evaluation: </span>
        <span
          ><a :href="`${MATURITY_EVALUATION_REQUEST.replaceAll('{name}', project.name)}`"
            ><FontAwesomeIcon :icon="faEnvelope" class="text-[#707070]" /></a
        ></span>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
const props = defineProps<{
  project: ExtendedProject;
}>();
const statusTags: { title: string; label: string }[] = [];
const statusColors = {
  [PROJECT_C4DT_STATUS.ACTIVE]: "\u{2705}",
  [PROJECT_C4DT_STATUS.RETIRED]: "\u{23F8}",
  [PROJECT_LAB_STATUS.ACTIVE]: "\u{2705}"
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
const title = ["Prototype", "Intermediate", "Mature"];
const pprintMaturity = ["\u{1f95a}", "\u{1f425}", "\u{1f414}"];
const grayscale = pprintMaturity.map((val, idx) => (idx <= maturity - 1 ? "bg-[#C1C1C1]" : "grayscale-100"));
</script>
