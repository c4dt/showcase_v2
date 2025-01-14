<script lang="ts" setup>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faUserSecret } from "@fortawesome/free-solid-svg-icons";

library.add(faUserSecret);

const props = defineProps<{
  project: any
}>()
const project = props.project
</script>

<template>
  <div
    class="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md border border-blue-gray-100">
    <img alt="Dela" :src="project.logo" class="pt-4 pr-4 pl-4 object-cover w-full h-auto">
    <div
      class="relative bg-clip-border mt-4 mx-4 rounded-xl overflow-hidden bg-transparent text-gray-700 shadow-none !m-0 p-6">
      <h5
        class="block antialiased tracking-normal font-sans text-xl font-semibold leading-snug text-blue-gray-900 capitalize">
        {{ project.name }}
      </h5>
      <p class="block antialiased font-sans text-sm leading-normal text-inherit font-normal !text-gray-500">
        {{ project.descriptionDisplay }}
      </p>
    </div>
    <div class="flex space-x-4 justify-end pb-4 pr-4">
      <a v-if="project.information" :href="project.information[0].url">
        <div class="text-right">
          <font-awesome :icon="['fa', 'newspaper']" class="fa-3x" />
        </div>
      </a>
      <a v-if="project.url" :href="project.url">
        <div class="text-right">
          <font-awesome :icon="['fa', 'home']" class="fa-3x" />
        </div>
      </a>
      <a v-if="project.code" :href="project.code.url">
        <div class="text-right">
          <font-awesome :icon="['fas', 'code']" class="fa-3x" />
        </div>
      </a>
    </div>
  </div>
</template>
