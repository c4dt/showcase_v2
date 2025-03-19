<template>
  <div v-for="tag in statusTags" :key="tag" class="flex pb-2 px-2 justify-end">
    {{ tag.desc }}
    <span :class="`px-3 py-1 rounded-full text-sm font-semibold text-white ${tag.colorStyleClasses} shadow-lg`">
      {{ tag.label }}
    </span>
  </div>
</template>
<script lang="ts" setup>
const props = defineProps<{
  project: ExtendedProject;
}>();
const project = props.project;
const statusTags = ref<{ label: string; color: string }[]>([]);
if (project.c4dt_status) {
  statusTags.value.push({
    desc: "C4DT support status:",
    label: project.c4dt_status,
    colorStyleClasses: "bg-gradient-to-r from-green-500 to-purple-600"
  });
}
if (project.lab_status) {
  statusTags.value.push({
    desc: "Lab support status:",
    label: project.lab_status,
    colorStyleClasses: "bg-gradient-to-r from-blue-500 to-purple-600"
  });
}
</script>
