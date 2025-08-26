<script setup lang="ts">
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
const project = useState<ExtendedProject>(`project-${useRoute().params.id}`);
const lab = project.value.lab;

const lastEdited = new Date(Date.parse(project.value.date_updated || project.value.date_added));
</script>
<template>
  <div>
    <div class="m-16 flex flex-col lg:flex-row">
      <div class="w-full pr-16 lg:w-70/100">
        <div class="py-4">
          <div class="flex items-center justify-center">
            <img :alt="project.name" :src="project.logo" class="h-32" />
          </div>
          <div class="flex">
            <div class="sm:flex-1">
              <ProjectDescription :project="project" />
              <div class="block sm:hidden">
                <ProjectQuality :project="project" />
              </div>
            </div>
            <div class="hidden sm:block sm:flex-shrink-0 sm:flex-grow-0 sm:basis-64 sm:justify-end">
              <ProjectQuality :project="project" />
            </div>
          </div>
          <div class="flex flex-wrap items-center gap-1">
            <span v-for="tag in project.tags.toSorted()" :key="tag" class="epfl-tag-light-not-clickable">
              {{ tag }}
            </span>
          </div>
        </div>
        <ProjectsTabs :project="project" />
      </div>
      <div class="w-full lg:w-30/100">
        <div class="bg-[#e6e6e6] px-8 text-center">
          <div class="py-4">
            <h2 class="epfl-h2">{{ project.lab.name }}</h2>
            <a class="epfl-a" :href="lab.url">{{ lab.name }}</a>
            <div>
              <div class="flex justify-center py-4">
                <NuxtImg
                  v-if="lab.prof.picture"
                  class="rounded-full"
                  :src="`/labs/${lab.prof.picture}`"
                  :alt="lab.prof.name.join(' ')"
                />
              </div>
              <p class="text-l text-center">
                Prof. {{ lab.prof.name.join(" ") }}
                <br />
                <a
                  class="text-xl text-[#212121] underline decoration-[#ff0000] hover:text-[#ff0000] hover:decoration-[#212121]"
                  :href="'mailto:' + lab.prof.email"
                  ><FontAwesomeIcon :icon="faEnvelope" class="text-[#707070]" /></a
                ><br />
              </p>
            </div>
          </div>
          <div class="py-4 text-left text-sm" v-html="lab.description" />
        </div>
      </div>
      <div class="block pt-16 lg:hidden">
        <div class="flex justify-center pb-16">
          <NuxtLink to="/"
            ><span class="cursor-pointer bg-[#ff0000] px-4 py-2 font-bold text-[#ffffff] hover:bg-[#b51f1f]"
              >Go back</span
            ></NuxtLink
          >
        </div>
        <p class="pb-2 text-center text-xs">
          This page was last edited on {{ lastEdited.toISOString().split("T")[0] }}.
        </p>
      </div>
    </div>
    <div class="hidden lg:block">
      <div class="flex justify-center pb-16">
        <NuxtLink to="/"
          ><span class="cursor-pointer bg-[#ff0000] px-4 py-2 font-bold text-[#ffffff] hover:bg-[#b51f1f]"
            >Go back</span
          ></NuxtLink
        >
      </div>
      <p class="pb-2 text-center text-xs">This page was last edited on {{ lastEdited.toISOString().split("T")[0] }}.</p>
    </div>
  </div>
</template>
