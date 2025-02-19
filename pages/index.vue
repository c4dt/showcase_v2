<script setup lang="ts">
import "vue3-carousel/carousel.css";
import { Carousel, Slide, Pagination, Navigation } from "vue3-carousel";

interface Project {
  id: string;
  name: string;
  is_highlighted: boolean;
  lab: string;
  categories: string[];
  applications: string[];
  tags: string[];
  description: string;
}

interface ProjectConfig {
  highlightedTags: string[];
  highlightedProjects: string[];
}

const carouselConfig = {
  itemsToShow: 1,
  height: 500,
  gap: 5,
  autoplay: 4000,
  wrapAround: true,
  pauseAutoplayOnHover: true,
  breakpointMode: "carousel",
  breakpoints: {
    400: {
      itemsToShow: 2,
      snapAlign: "start"
    },
    800: {
      itemsToShow: 3,
      snapAlign: "start"
    },
    1100: {
      itemsToShow: 4,
      snapAlign: "start"
    }
  }
};

const searchQuery = ref("");
const selectedLab = ref("");
const selectedCategory = ref("");
const selectedApplication = ref("");
const selectedHighlightedTag = ref("");
const selectedTags = ref<string[]>([]);
provide("selectedTags", selectedTags);

function addTag(tag: string) {
  if (!selectedTags.value.includes(tag)) {
    selectedTags.value.push(tag);
  }
}
provide("addTag", addTag);

function filterByTag(tag: string) {
  selectedHighlightedTag.value = tag;
}

function removeTag(tag: string) {
  selectedTags.value = selectedTags.value.filter((t) => t !== tag);
}

function resetFilters() {
  selectedLab.value = "";
  selectedCategory.value = "";
  selectedApplication.value = "";
  selectedHighlightedTag.value = "";
  searchQuery.value = "";
  selectedTags.value = [];
}

const route = useRoute();
const queryParams = route.query;
const searchQueryParam = queryParams.search as string;

if (searchQueryParam) {
  searchQuery.value = searchQueryParam;
}

watch(route.query, () => {
  searchQuery.value = (route.query.search as string) || "";
});

const { data: projects } = await useFetch<Project[]>("/api/projects");
const { data } = await useFetch<ProjectConfig>("/api/configuration");

const projectConfig = ref<ProjectConfig>({
  highlightedTags: [],
  highlightedProjects: []
});

if (data.value) {
  projectConfig.value = data.value;
}

let labs: string[] = [];
let categories: string[] = [];
let applications: string[] = [];
let highlightedProjects: Project[] = [];
let highlightedTags: string[] = [];

if (projects.value) {
  labs = Array.from(new Set(projects.value.map((project) => project.lab)));
  categories = Array.from(new Set(projects.value.flatMap((project) => project.categories)));
  applications = Array.from(new Set(projects.value.flatMap((project) => project.applications)));
  highlightedProjects = projects.value.filter((project) =>
    projectConfig.value.highlightedProjects.includes(project.name)
  );
  highlightedTags = projectConfig.value.highlightedTags;
}

const filteredProjects = computed(() => {
  if (!projects.value) return [];
  return projects.value.filter((project) => {
    return (
      (selectedLab.value === "" || project.lab === selectedLab.value) &&
      (selectedCategory.value === "" || project.categories.includes(selectedCategory.value)) &&
      (selectedApplication.value === "" || project.applications.includes(selectedApplication.value)) &&
      (selectedHighlightedTag.value === "" || project.tags.includes(selectedHighlightedTag.value)) &&
      (searchQuery.value === "" || project.name.toLowerCase().includes(searchQuery.value.toLowerCase())) &&
      (selectedTags.value.length === 0 || selectedTags.value.some((tag) => project.tags.includes(tag)))
    );
  });
});
</script>

<template>
  <div class="px-24 py-2 bg-white">
    <section class="relative isolatept-14 lg:px-8">
      <div class="mx-auto max-w-10xl">
        <div class="text-center">
          <h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Welcome to the Center for Digital Trust's Showcase
          </h1>
          <p class="mt-6 text-lg leading-8 text-gray-600">
            This page presents all projects from the labs affiliated to the Center for Digital Trust. You can filter the
            projects according to your preferences. Clicking on one of the projects will show an in-depth description.
          </p>
        </div>
      </div>
    </section>
    <section class="py-12">
      <div class="text-center">
        <h2 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Selected Projects</h2>
      </div>

      <Carousel class="mt-12" v-bind="carouselConfig">
        <Slide v-for="project in highlightedProjects" :key="project.name">
          <HomepageCarouselItem :project="project" class="h-full" />
        </Slide>

        <template #addons>
          <Navigation />
          <Pagination />
        </template>
      </Carousel>
    </section>
    <section class="px-12 py-24">
      <div class="flex">
        <!-- Sidebar with filter -->
        <div class="w-1/4 pr-4">
          <div class="sticky top-0">
            <div class="bg-white p-4 border rounded-lg shadow-md mb-4">
              <div class="font-bold">Filter by</div>
              <homepageCombobox v-model="selectedLab" title="Lab" :item-list="labs" />
              <homepageCombobox v-model="selectedCategory" title="Category" :item-list="categories" />
              <homepageCombobox v-model="selectedApplication" title="Application" :item-list="applications" />
              <div class="flex flex-wrap space-x-2 space-y-2">
                <div
                  v-for="tag in selectedTags"
                  :key="tag"
                  class="flex items-center space-x-2 px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm"
                >
                  <span>{{ tag }}</span>
                  <button
                    class="text-red-500 hover:text-red-700 focus:outline-none"
                    aria-label="Remove tag"
                    @click="removeTag(tag)"
                  >
                    x
                  </button>
                </div>
              </div>
              <div
                class="text-center py-2 border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 cursor-pointer"
                @click="resetFilters"
              >
                Reset Filters
              </div>
            </div>
          </div>
        </div>

        <!-- Main projects area -->
        <div class="w-3/4">
          <div class="sticky border top-0 mb-4 bg-white rounded-xl shadow-md py-2 px-6">
            <ul class="flex space-x-4 py-6 justify-center">
              <li
                v-for="tag in highlightedTags"
                :key="tag"
                class="cursor-pointer px-6 py-2 border border-gray-300 rounded-md shadow-sm"
                :class="[
                  selectedHighlightedTag === tag
                    ? 'cursor-default bg-blue-500 text-white'
                    : 'bg-white hover:bg-blue-400'
                ]"
                @click="filterByTag(tag)"
              >
                {{ tag === "" ? "ALL" : tag }}
              </li>
            </ul>
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Looking for something specific?"
                class="w-full py-2 pl-10 pr-4 text-gray-700 bg-gray-200 rounded-full focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-300"
              />
              <div class="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg
                  class="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div>
            <div v-for="project in filteredProjects" :key="project.name" class="py-4">
              <homepageProjectCard :project="project" />
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
