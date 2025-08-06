<template>
  <div class="border border-[#707070] px-2 py-1">
    <div class="text-xl">Key facts</div>
    <div class="grid grid-cols-2 items-center">
      <div>Maturity</div>
      <div v-if="maturity" class="flex">
        <div>
          <FontAwesomeIcon
            v-for="(val, idx) in pprintMaturity"
            :key="val"
            :title="maturityTitle[idx]"
            :icon="val"
            :class="`pr-2 ${maturityTextStyle[idx]} cursor-help`"
          />
        </div>
      </div>
      <div v-if="maturity === 0">
        <a
          :href="`${MATURITY_EVALUATION_REQUEST.replaceAll('{name}', project.name)}`"
          :aria-label="evaluationRequestTitle"
          :title="evaluationRequestTitle"
          ><FontAwesomeIcon :icon="faEnvelope" class="text-xl text-[#707070]"
        /></a>
      </div>
      <div class="col-span-2">Support</div>
      <!-- use `template` element to iterate so that columns are counted correctly -->
      <template v-for="tag in statusTags" :key="tag">
        <div class="text-[#707070]">
          {{ tag.desc }}
        </div>
        <FontAwesomeIcon :icon="tag.label" class="cursor-help text-xl text-[#707070]" :title="tag.title" />
      </template>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faEnvelope, faRulerCombined, faHammer, faBuilding } from "@fortawesome/free-solid-svg-icons";
const props = defineProps<{
  project: ExtendedProject;
}>();
const statusTags: { title: string; label: string }[] = [];
const c4dtStatus = props.project.c4dt_status ?? PROJECT_C4DT_STATUS.INACTIVE;
statusTags.push({
  title: c4dtStatus,
  desc: PROJECT_STATUS_DESC.C4DT_STATUS,
  label: PROJECT_STATUS_ICONS[c4dtStatus]
});
const labStatus = props.project.lab_status ?? PROJECT_LAB_STATUS.UNKNOWN;
statusTags.push({
  title: labStatus,
  desc: PROJECT_STATUS_DESC.LAB_STATUS,
  label: PROJECT_STATUS_ICONS[labStatus]
});
const maturity = props.project.maturity ?? 0;
const maturityTitle = ["Prototype", "Intermediate", "Mature"];
const pprintMaturity = [faRulerCombined, faHammer, faBuilding];
const maturityTextStyle = pprintMaturity.map((val, idx) =>
  idx <= maturity - 1 ? "text-xl text-[#707070]" : "text-sm text-[#c1c1c1]"
);
const evaluationRequestTitle = "Send evaluation request";
</script>
