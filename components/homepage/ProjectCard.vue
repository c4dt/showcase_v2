<template>
  <div class="mx-auto bg-white rounded-xl shadow-md overflow-hidden">
    <div class="p-8">
      <div class="flex justify-between items-start">
        <div class="flex-grow">
          <h2 class="text-2xl font-bold mb-2">{{ project.name }}</h2>
          <p class="text-gray-600 mb-4">{{ project.descriptionDisplay }}</p>
        </div>
      </div>
      <div class="flex space-x-2">
        <span class="text-right">
          <font-awesome :icon="['fa', 'tags']" class="fa-1x text-gray-500" />
        </span>
        <span class="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm" v-for="tag in project.tags">{{ tag
          }}</span>
      </div>


      <div class="flex space-x-4 justify-end">
        <div
          v-for="information in project.information.filter(information => information.type.toLowerCase() == 'article')"
          v-if="project.information">
          <a :href="information.url" class="text-gray-500 hover:underline flex items-center">
            <div class="text-right">
              <font-awesome :icon="['fa', 'newspaper']" class=" text-gray-500 fa-2x" />
            </div>
          </a>
        </div>
        <div v-for="information in project.information.filter(information => information.type.toLowerCase() == 'paper')"
          v-if="project.information">
          <a :href="information.url" class="text-gray-500 hover:underline flex items-center">
            <div class="text-right">
              <font-awesome :icon="['far', 'file']" class=" text-gray-500 fa-2x" />
            </div>
          </a>
        </div>
        <a :href="project.url" class="text-gray-500 hover:underline flex items-center" v-if="project.url">
          <div class="text-right">
            <font-awesome :icon="['fa', 'home']" class=" text-gray-500 fa-2x" />
          </div>
        </a>
        <a :href="project.code.url" class="text-gray-500 hover:underline flex items-center" v-if="project.code">
          <div class="text-right">
            <font-awesome :icon="['fab', 'github']" class=" text-gray-500 fa-2x"
              v-if="project.code.type.toLowerCase().includes('github')" />
          </div>
          <div class="text-right">
            <font-awesome :icon="['fas', 'code']" class=" text-gray-500 fa-2x"
              v-if="!project.code.type.toLowerCase().includes('github')" />
          </div>
        </a>
        <a :href="'mailto:' + project.contacts.map(contact => contact.email).join(',')"
          class="text-gray-500 hover:underline flex items-center" v-if="project.contacts">
          <div class="text-right">
            <font-awesome :icon="['fas', 'envelope']" class=" text-gray-500 fa-2x" />
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
const props = defineProps<{
  project: Object
}>()
console.log(props);
</script>
