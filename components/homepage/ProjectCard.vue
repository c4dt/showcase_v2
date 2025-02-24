<template>
  <div class="mx-auto bg-white rounded-xl shadow-md overflow-hidden">
    <div class="p-8">
      <NuxtLink :to="{ name: 'projects-id', params: { id: project.id } }">
        <div class="flex justify-between items-start">
          <div class="grow">
            <h2 class="text-2xl font-bold mb-2">{{ project.name }}</h2>
            <p class="text-gray-600 mb-4">
              {{ project.descriptionDisplay }}
            </p>
          </div>
        </div>
      </NuxtLink>
      <div class="flex space-x-2">
        <span class="text-right">
          <font-awesome :icon="['fa', 'tags']" class="fa-1x text-gray-500" />
        </span>
        <span
          v-for="tag in project.tags"
          :class="{
            'px-3 py-1 rounded-full text-sm transition': true,
            'bg-gray-400 text-gray-950 cursor-not-allowed': selectedTags.includes(tag),
            'bg-gray-200 text-gray-800 cursor-pointer hover:bg-gray-300 hover:text-gray-900':
              !selectedTags.includes(tag)
          }"
          @click="addTag(tag)"
        >
          {{ tag }}
        </span>
      </div>

      <div class="flex space-x-4 justify-end">
        <div
          v-for="information in project.information.filter(
            (information) => information.type.toLowerCase() == 'article'
          )"
          v-if="project.information"
        >
          <a :href="information.url" class="text-gray-500 hover:underline flex items-center">
            <div class="text-right">
              <font-awesome :icon="['fa', 'newspaper']" class="text-gray-500 fa-2x" />
            </div>
          </a>
        </div>
        <div
          v-for="information in project.information.filter((information) => information.type.toLowerCase() == 'paper')"
          v-if="project.information"
        >
          <a :href="information.url" class="text-gray-500 hover:underline flex items-center">
            <div class="text-right">
              <font-awesome :icon="['far', 'file']" class="text-gray-500 fa-2x" />
            </div>
          </a>
        </div>
        <a v-if="project.url" :href="project.url" class="text-gray-500 hover:underline flex items-center">
          <div class="text-right">
            <font-awesome :icon="['fa', 'home']" class="text-gray-500 fa-2x" />
          </div>
        </a>
        <a v-if="project.code" :href="project.code.url" class="text-gray-500 hover:underline flex items-center">
          <div class="text-right">
            <font-awesome
              v-if="project.code.type.toLowerCase().includes('github')"
              :icon="['fab', 'github']"
              class="text-gray-500 fa-2x"
            />
          </div>
          <div class="text-right">
            <font-awesome
              v-if="!project.code.type.toLowerCase().includes('github')"
              :icon="['fas', 'code']"
              class="text-gray-500 fa-2x"
            />
          </div>
        </a>
        <a
          v-if="project.contacts"
          :href="'mailto:' + project.contacts.map((contact) => contact.email).join(',')"
          class="text-gray-500 hover:underline flex items-center"
        >
          <div class="text-right">
            <font-awesome :icon="['fas', 'envelope']" class="text-gray-500 fa-2x" />
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faUserSecret } from "@fortawesome/free-solid-svg-icons";

library.add(faUserSecret);
defineProps<{
  project: object;
}>();

const selectedTags = inject("selectedTags") as Ref<string[]>;
const addTag = inject("addTag") as (tag: string) => void;
</script>
