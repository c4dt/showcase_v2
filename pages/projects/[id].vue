<script setup lang="ts">
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faTags, faEnvelope } from "@fortawesome/free-solid-svg-icons";
const project = useState<ExtendedProject>(`project-${useRoute().params.id}`);
const lab = project.value.lab;

const lastEdited = new Date(Date.parse(project.value.date_updated || project.value.date_added));
</script>
<template>
  <div class="flex m-16">
    <div class="pr-16 flex-[7]">
      <div class="py-4">
        <div class="flex items-center justify-center">
          <img :alt="project.name" :src="project.logo" class="h-32" />
        </div>
        <div class="flex">
          <div class="sm:flex-1">
            <ProjectDescription :project="project" />
            <div class="sm:hidden block">
              <ProjectQuality :project="project" />
            </div>
          </div>
          <div class="hidden sm:block sm:justify-end sm:basis-64 sm:flex-shrink-0 sm:flex-grow-0">
            <ProjectQuality :project="project" />
          </div>
        </div>
        <div class="flex items-center space-x-2 text-left">
          <FontAwesomeIcon :icon="faTags" class="text-gray-500" />
          <span
            v-for="tag in project.tags"
            :key="tag"
            class="px-3 py-1 rounded-full text-sm bg-[#d5d5d5] text-[#707070]"
          >
            {{ tag }}
          </span>
        </div>
      </div>
      <ProjectsTabs :project="project" />
      <div class="flex justify-center pb-16">
        <NuxtLink to="/"
          ><span class="bg-[#ff0000] font-bold text-[#ffffff] px-4 py-2 cursor-pointer hover:bg-[#b51f1f]"
            >Go back</span
          ></NuxtLink
        >
      </div>
      <p class="text-xs text-center pb-2">This page was last edited on {{ lastEdited.toDateString() }}.</p>
    </div>
    <div class="flex-[3]">
      <div class="px-8 bg-[#e6e6e6] text-center">
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
            <p class="text-center text-l">
              Prof. {{ lab.prof.name.join(" ") }}
              <br />
              <a
                class="underline text-[#212121] hover:text-[#ff0000] decoration-[#ff0000] hover:decoration-[#212121] text-xl"
                :href="'mailto:' + lab.prof.email"
                ><FontAwesomeIcon :icon="faEnvelope" class="text-[#707070]" /></a
              ><br />
            </p>
          </div>
        </div>
        <div class="py-4 text-left text-sm" v-html="lab.description" />
      </div>
    </div>
  </div>
</template>
