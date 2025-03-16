<template>
  <div class="flex space-x-4 justify-end">
    <span
      v-for="tag in statusTags"
      :key="tag.label"
      :class="`px-3 py-1 rounded-full text-sm font-semibold text-white ${tag.colorStyleClasses} shadow-lg`"
    >
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
    label: project.c4dt_status,
    colorStyleClasses:
      project.c4dt_status === "C4DT Active"
        ? "bg-gradient-to-r from-green-500 to-purple-600"
        : "bg-gradient-to-r from-red-500 to-purple-600"
  });
}
if (project.lab_status == "Lab Active") {
  statusTags.value.push({
    label: project.lab_status,
    colorStyleClasses: "bg-gradient-to-r from-blue-500 to-purple-600"
  });
}
</script>
