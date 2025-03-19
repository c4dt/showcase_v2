<template>
  <div v-for="tag in statusTags" :key="tag" class="flex pb-2 px-2 justify-end">
    <div class="px-4">
      {{ tag.desc }}
      <span :class="`px-3 py-1 rounded-full text-sm font-semibold text-white ${tag.colorStyleClasses} shadow-lg`">
        {{ tag.label }}
      </span>
    </div>
  </div>
</template>
<script lang="ts" setup>
const props = defineProps<{
  project: ExtendedProject;
}>();
const project = props.project;
const statusTags = ref<{ label: string; color: string }[]>([]);
const statusColor = {
  [PROJECT_STATUS.C4DT_SUPPORT_ACTIVE]: "bg-green-500",
  [PROJECT_STATUS.C4DT_SUPPORT_RETIRED]: "bg-orange-500",
  [PROJECT_STATUS.LAB_MAINTENANCE_ACTIVE]: "bg-green-500"
};
if (project.c4dt_status) {
  statusTags.value.push({
    desc: "C4DT support status:",
    label: project.c4dt_status,
    colorStyleClasses: statusColor[project.c4dt_status]
  });
}
if (project.lab_status) {
  statusTags.value.push({
    desc: "Lab maintenance status:",
    label: project.lab_status,
    colorStyleClasses: statusColor[project.lab_status]
  });
}
</script>
